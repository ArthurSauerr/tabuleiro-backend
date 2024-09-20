const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
    const payload = { email };
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '168h' });
}

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const client = await pool.connect();
        const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();
        if (userExists.rows.length > 0) {
            return res.status(400).send('Usuário já existe!');
        } else {
            const newUser = await client.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, hashedPassword]
            );
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser.rows[0] });
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário: ', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário!' });
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();
        const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();
        if(userExists.rows.length > 0 ){
            const user = userExists.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const token = generateAccessToken(email);
                return res.status(200).json({ token });
            } else {
                return res.status(400).send('Email ou senha incorretos!')
            }
        } else {
            return res.status(404).send('Não existe um usuário cadastrado com esse email!')
        }
    } catch(error) {
        console.error('Erro ao realizar login: ', error);
        res.status(500).send('Erro ao realizar login!');
    }
}

exports.readUser = async (req, res) => {
    const { id } = req.body;

    try {
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        client.release();
        if(user.rows.length > 0) {
            return res.status(200).json({ user: user.rows[0] });
        } else {
            return res.status(404).send('Usuário não encontrado.');
        }
    } catch(error) {
        console.error('Erro ao buscar usuário: ', error);
        res.status(500).send('Erro ao buscar usuário!');
    }
}