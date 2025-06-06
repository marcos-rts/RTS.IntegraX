// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();
const mysql = require('mysql2');

// Verifica se as variáveis de ambiente necessárias estão definidas
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Erro: Variáveis de ambiente DB_USER e DB_PASS não configuradas');
    console.error('Por favor, crie um arquivo .env baseado no .env.example');
    process.exit(1);
}

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,          // Endereço do servidor MySQL
    user: process.env.DB_USER,  // Usuário do MySQL (definido no .env)
    password: process.env.DB_PASSWORD, // Senha do MySQL (definida no .env)
    database: 'RTS_controle_itens'  // Nome do banco de dados
});

// Tenta estabelecer a conexão com o banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        throw err;
    }
    console.log('Conectado ao MySQL!');
});

// Exporta a conexão para ser usada em outros arquivos
module.exports = db;