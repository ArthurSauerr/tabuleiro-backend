const pool = require('../config/database');
const AbilityUpdateDTO = require('../dto/AbilityUpdateDTO');

exports.newAbility= async (req, res) => {
    const { id } = req.user;
    const { name, description, char_id} = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO abilities (name, description, character_id) VALUES ($1, $2, $3) RETURNING *',
                [name, description, char_id]
            );
            client.release();
            res.status(200).send('Habilidade criada com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao criar nova habilidade: ', error);
        res.status(500).send('Erro ao criar nova habilidade!');
    }
}

exports.readAllAbilities = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const readAbilities = await client.query('SELECT * FROM abilities WHERE character_id = $1', [char_id]);
            client.release();
            return res.status(200).json({ abilities: readAbilities.rows });
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao buscar habilidades: ', error);
        res.status(500).send('Erro ao buscar habilidades!');
    }
}

exports.updateAbility = async (req, res) => {
    const { id } = req.user;
    const { char_id, abl_id } = req.body;
    const abilityUpdateDTO = new AbilityUpdateDTO(req.body);
    const updateData = abilityUpdateDTO.sanitize();

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

        values.push(char_id, abl_id);
        const updateQuery = `
            UPDATE abilities
            SET ${fields.join(', ')}
            WHERE character_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedAbility = await client.query(updateQuery, values);
            client.release();
            if (updatedAbility.rows.length > 0) {
                return res.status(200).json(updatedAbility.rows[0]);
            } else {
                return res.status(404).send('Habilidade não encontrada, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar habilidade: ', error);
        res.status(500).send('Erro ao atualizar habilidade!');
    }
}
