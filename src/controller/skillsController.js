const pool = require('../config/database');
const SkillsUpdateDTO = require('../dto/SkillsUpdateDTO');

exports.newSkill= async (req, res) => {
    const { id } = req.user;
    const { name, value, parent_attribute, char_id} = req.body;

    try { 
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('INSERT INTO skills (name, value, parent_attribute, character_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, value, parent_attribute, char_id]
            );
            client.release();
            res.status(200).send('Aptidão criada com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) { 
        console.error('Erro ao criar nova aptidão: ', error);
        res.status(500).send('Erro ao criar nova aptidão!');
    }
}

exports.updateSkill = async (req, res) => {
    const { id } = req.user;
    const { char_id, skill_id } = req.body;
    const skillsUpdateDTO = new SkillsUpdateDTO(req.body);
    const updateData = skillsUpdateDTO.sanitize();

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

        values.push(char_id, skill_id);
        const updateQuery = `
            UPDATE skills
            SET ${fields.join(', ')}
            WHERE character_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedSkill = await client.query(updateQuery, values);
            client.release();
            if (updatedSkill.rows.length > 0) {
                return res.status(200).json(updatedSkill.rows[0]);
            } else {
                return res.status(404).send('Aptidão não encontrada, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar aptidão: ', error);
        res.status(500).send('Erro ao atualizar aptidão!');
    }
}

exports.deleteSkill = async (req, res) => {
    const { id } = req.user;
    const { char_id, skill_id } = req.params;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            await client.query('DELETE FROM skills WHERE character_id = $1 AND id = $2', [char_id, skill_id]);
            return res.status(200).send('Apidão excluida com sucesso.')
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao excluir aptidão: ', error);
        res.status(500).send('Erro ao excluir aptidão!');
    }
}