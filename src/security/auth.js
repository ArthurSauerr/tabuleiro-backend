const jwt = require('jsonwebtoken');
const pool = require('../config/database');

async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.sendStatus(403);
    }

    const token = authorization.replace('Bearer', '');
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = await getUserIdFromToken(decoded.email);
        if(userId) {
            req.user = { email: decoded.email, id: userId };
            next();
        } else {
            req.sendStatus(403);
        }
    } catch (error) { 
        res.sendStatus(403);
    }
}

async function getUserIdFromToken(email) {
    try { 
        const client = await pool.connect();
        const result = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        client.release();
        if(result.rows.length > 0) {
            return result.rows[0].id;
        }
        return null;
    } catch (error) {
        console.error('Erro ao extrair id do usuário', error);
    }
}

module.exports = { validateToken };