const pool = require('../config/database');
const InventoryUpdateDTO = require('../dto/InventoryUpdateDTO');

exports.newItem = async (req, res) => {
    const { id } = req.user;
    const { item, quantity, weight, diceNumber, diceQtd, char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO inventory (item, quantity, weight, diceNumber, diceQtd, character_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [item, quantity, weight, diceNumber, diceQtd, char_id]
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

exports.updateInventoryItem = async (req, res) => {
    const { id } = req.user;
    const { char_id, item_id } = req.body;
    const inventoryUpdateDTO = new InventoryUpdateDTO(req.body);
    const updateData = inventoryUpdateDTO.sanitize();

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

        values.push(char_id, item_id);
        const updateQuery = `
            UPDATE inventory
            SET ${fields.join(', ')}
            WHERE character_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedItem = await client.query(updateQuery, values);
            client.release();
            if (updatedItem.rows.length > 0) {
                return res.status(200).json(updatedItem.rows[0]);
            } else {
                return res.status(404).send('Item não encontrado, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar item: ', error);
        res.status(500).send('Erro ao atualizar item!');
    }
}

exports.deleteInventoryItem = async (req, res) => {
    const { id } = req.user;
    const { char_id, item_id } = req.params;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('DELETE FROM inventory WHERE character_id = $1 AND id = $2', [char_id, item_id]);
            return res.status(200).send('Item excluido com sucesso.')
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao excluir item: ', error);
        res.status(500).send('Erro ao excluir item!');
    }
}