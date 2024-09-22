const pool = require('../config/database');
const CharacterUpdateDTO = require('../dto/CharacterUpdateDTO');

exports.newCharacter = async (req, res) => {
    const { id } = req.user;
    const { 
        name, age, char_class,
        char_subclass, nacionality, 
        max_health, current_health, max_stamina, 
        current_stamina, max_mana, current_mana, 
        max_sanity, current_sanity, money
    } = req.body;

    try { 
        const client = await pool.connect();
        const newCharacter = await client.query(
            'INSERT INTO character (name, age, class, sub_class, nacionality, max_health, current_health, ' +
            'max_stamina, current_stamina, max_mana, current_mana, max_sanity, current_sanity, money, user_id) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
            [
                name, age, char_class, 
                char_subclass, nacionality,
                max_health, current_health, max_stamina, 
                current_stamina, max_mana, current_mana, 
                max_sanity, current_sanity, money, id  
            ]
        );
        client.release();
        res.status(201).send('Personagem criado com sucesso.');
    } catch (error) {
        console.error('Erro ao criar personagem: ', error);
        res.status(500).send('Erro ao criar personagem!');
    }
}

exports.readAllCharacters = async (req, res) => {
    const { id } = req.user;

    try { 
        const client = await pool.connect();
        const readCharacter = await client.query('SELECT * FROM character WHERE user_id = $1', [id]);
        client.release();
        if (readCharacter.rows.length > 0) {
            return res.status(200).json({ characters: readCharacter.rows });
        } else {
            return res.status(404).send('Você não possui personagens cadastrados.');
        }
    } catch (error) {
        console.error('Erro ao buscar personagens: ', error);
        res.status(500).send('Erro ao buscar personagens!');
    }
}

exports.readCharacterById = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try { 
        const client = await pool.connect();
        const readCharacter = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        client.release();
        if (readCharacter.rows.length > 0) {
            return res.status(200).json( readCharacter.rows[0] );
        } else {
            return res.status(404).send('Personagem não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar personagem: ', error);
        res.status(500).send('Erro ao buscar personagem!');
    }
}

exports.readAllInfoCharacter = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length === 0) {
            return res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }

        const characterInfo = await client.query(
            'SELECT * FROM character WHERE id = $1', [char_id]
        );

        const attributesInfo = await client.query(
            'SELECT * FROM attributes WHERE character_id = $1', [char_id]
        );

        const abilitiesInfo = await client.query(
            'SELECT * FROM abilities WHERE character_id = $1', [char_id]
        );

        const spellsInfo = await client.query(
            'SELECT * FROM spells WHERE character_id = $1', [char_id]
        );

        const inventoryInfo = await client.query(
            'SELECT * FROM inventory WHERE character_id = $1', [char_id]
        );
        client.release();

        const response = {
            character: characterInfo.rows[0],
            attributes: attributesInfo.rows,
            abilities: abilitiesInfo.rows,
            spells: spellsInfo.rows,
            inventory: inventoryInfo.rows
        };
        return res.status(200).json(response);
    } catch (error) {
        console.error('Erro ao buscar personagem: ', error);
        res.status(500).send('Erro ao buscar personagem!');
    }
};

exports.updateCharacter = async (req, res) => {
    const { char_id } = req.body;
    const { id } = req.user;
    const characterUpdateDTO = new CharacterUpdateDTO(req.body);
    const updateData = characterUpdateDTO.sanitize();

    try {
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in updateData) {
            fields.push(`${key} = $${index}`);
            values.push(updateData[key]);
            index++;
        }

        if (fields.length === 0) {
            return res.status(400).send('Nenhum campo para atualizar.');
        }

        values.push(id, char_id);
        const updateQuery = `
            UPDATE character
            SET ${fields.join(', ')}
            WHERE user_id = $${index} AND id = $${index + 1}
            RETURNING *;
        `;

        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if (checkUser.rows.length > 0) {
            const updatedCharacter = await client.query(updateQuery, values);
            client.release();
            if (updatedCharacter.rows.length > 0) {
                return res.status(200).json(updatedCharacter.rows[0]);
            } else {
                return res.status(404).send('Personagem não encontrado, ou não autorizado.');
            }
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao atualizar personagem: ', error);
        res.status(500).send('Erro ao atualizar personagem!');
    }
}

exports.deleteCharacter = async (req, res) => {
    const { id } = req.user;
    const { char_id } = req.body;

    try {
        const client = await pool.connect();
        const checkUser = await client.query('SELECT * FROM character WHERE user_id = $1 AND id = $2', [id, char_id]);
        if(checkUser.rows.length > 0){
            await client.query('DELETE FROM abilities WHERE character_id = $1', [char_id]);
            await client.query('DELETE FROM attributes WHERE character_id = $1', [char_id]);
            await client.query('DELETE FROM inventory WHERE character_id = $1', [char_id]);
            await client.query('DELETE FROM character WHERE id = $1', [char_id]);
            return res.status(200).send('Personagem excluido com sucesso.');
        } else {
            res.status(403).send('Você não tem permissão para utilizar esse personagem!');
        }
    } catch (error) {
        console.error('Erro ao excluir personagem: ', error);
        res.status(500).send('Erro ao excluir personagem!');
    }
}