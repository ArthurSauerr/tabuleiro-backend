const pool = require('../config/database');

exports.newAttribute = async (req, res) => {
    const { id } = req.user;
    const { name, value, char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO attributes (name, value, character_id) VALUES ($1, $2, $3) RETURNING *',
                [name, value, char_id]
            );
            client.release();
            res.status(200).send('Atributo criado com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao criar novo atributo: ', error);
        res.status(500).send('Erro ao criar novo atributo!');
    }
}

exports.readAllCharAttributes = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const readAttributes = await client.query('SELECT * FROM attributes WHERE character_id = $1', [char_id]);
            client.release();
            return res.status(200).json({ attributes: readAttributes.rows });
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao buscar atributos: ', error);
        res.status(500).send('Erro ao buscar atributos!');
    }
}
