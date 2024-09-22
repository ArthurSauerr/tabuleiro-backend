const { Pool } = require('pg');

// Configuração da pool de conexão com Supabase
const pool = new Pool({
    connectionString: process.env.SUPABASE_CONNECTION_STRING, // Variável de ambiente para armazenar a string de conexão
    ssl: {
        rejectUnauthorized: false // Necessário para conexões SSL com Supabase
    }
});

module.exports = pool;