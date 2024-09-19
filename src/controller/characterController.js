const pool = require('../config/database');

exports.newCharacter = async (req, res) => {
    const { id } = req.user;
    const { 
        name, age, char_class, 
        max_health, current_health, max_stamina, 
        current_stamina, max_mana, current_mana, 
        max_sanity, current_sanity, money
    } = req.body;

    try { 
        const client = await pool.connect();
        const newCharacter = await client.query(
            'INSERT INTO character (name, age, class, max_health, current_health, ' +
            'max_stamina, current_stamina, max_mana, current_mana, max_sanity, current_sanity, money, user_id) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
            [
                name, age, char_class, 
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

exports.readAllCharacters = async(req, res) => {
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

exports.readCharacterById = async(req, res) => {
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