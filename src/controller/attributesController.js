const pool = require('../config/database');
const AttributeUpdateDTO = require('../dto/AttributeUpdateDTO');

exports.newAttribute = async (req, res) => {
    const { id } = req.user;
    const { name, value, diceNumber, char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO attributes (name, value, dicenumber, character_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, value, diceNumber, char_id]
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

exports.updateAttribute = async (req ,res) => {
    const { id } = req.user;
    const { char_id, atr_id } = req.body;
    const attributeUpdateDTO = new AttributeUpdateDTO(req.body);
    const updateData = attributeUpdateDTO.sanitize();

    try {
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in updateData) {
            fields.push(`${key} = $${index}`);
            values.push(updateData[key]);
            index++
        }

        if (fields.length === 0) {
            return res.status(400).send('Nenhum campo para atualizar.');
        }

        values.push(char_id, atr_id);
        const updateQuery = `
            UPDATE attributes
            SET ${fields.join(', ')}
            WHERE character_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedAttribute = await client.query(updateQuery, values);
            client.release();
            if (updatedAttribute.rows.length > 0) {
                return res.status(200).json(updatedAttribute.rows[0]);
            } else {
                return res.status(404).send('Atributo não encontrado, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar atributo: ', error);
        res.status(500).send('Erro ao atualizar atributo!');
    }
}

exports.deleteAttribute = async (req, res) => {
    const { id } = req.user;
    const { char_id, atr_id } = req.body;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('DELETE FROM attributes WHERE character_id = $1 AND id = $2', [char_id, atr_id]);
            return res.status(200).send('Atributo excluido com sucesso.')
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao excluir atributoL: ', error);
        res.status(500).send('Erro ao excluir atributo!');
    }
}
