const pool = require('../config/database');
const SpellUpdateDTO = require('../dto/SpellUpdateDTO');

exports.newSpell = async (req, res) => {
    const { id } = req.user;
    const { name, description, cost, cost_type, diceNumber, diceQtd, char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO spells (name, description, cost, cost_type, diceNumber, diceQtd, character_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [name, description, cost, cost_type, diceNumber, diceQtd, char_id]
            );
            client.release();
            res.status(200).send('Magia criada com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao criar nova magia: ', error);
        res.status(500).send('Erro ao criar nova magia!');
    }
}

exports.readAllSpells = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const readSpells = await client.query('SELECT * FROM spells WHERE character_id = $1', [char_id]);
            client.release();
            return res.status(200).json({ spells: readSpells.rows });
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao buscar magias: ', error);
        res.status(500).send('Erro ao buscar magias!');
    }
}

exports.updateSpell = async (req, res) => {
    const { id } = req.user;
    const { char_id, spell_id } = req.body;
    const spellUpdateDTO = new SpellUpdateDTO(req.body);
    const updateData = spellUpdateDTO.sanitize();

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

        values.push(char_id, spell_id);
        const updateQuery = `
            UPDATE spells
            SET ${fields.join(', ')}
            WHERE character_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedSpell = await client.query(updateQuery, values);
            client.release();
            if (updatedSpell.rows.length > 0) {
                return res.status(200).json(updatedSpell.rows[0]);
            } else {
                return res.status(404).send('Magia não encontrada, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar magia: ', error);
        res.status(500).send('Erro ao atualizar magia!');
    }
}

exports.deleteSpell = async (req, res) => {
    const { id } = req.user;
    const { char_id, spell_id } = req.body;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('DELETE FROM spells WHERE character_id = $1 AND id = $2', [char_id, spell_id]);
            return res.status(200).send('Magia excluida com sucesso.')
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao excluir magia: ', error);
        res.status(500).send('Erro ao excluir magia!');
    }
}