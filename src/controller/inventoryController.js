const pool = require('../config/database');

exports.newItem= async (req, res) => {
    const { id } = req.user;
    const { item, quantity, weight,char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO inventory (item, quantity, weight,character_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [item, quantity, weight, char_id]
            );
            client.release();
            res.status(200).send('Item criado com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao criar novo item: ', error);
        res.status(500).send('Erro ao criar novo item!');
    }
}

exports.readAllCharItems = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const readInventory = await client.query('SELECT * FROM inventory WHERE character_id = $1', [char_id]);
            client.release();
            return res.status(200).json({ items: readInventory.rows });
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao buscar itens no inventário: ', error);
        res.status(500).send('Erro ao buscar itens no inventário!');
    }
}
