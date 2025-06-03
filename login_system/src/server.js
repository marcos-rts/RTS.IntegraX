const sequelize = require('./config/database');
const User = require('./models/user');

sequelize.sync({ alter: true }) // CUIDADO: 'alter' faz update nas tabelas se mudar os modelos
  .then(() => console.log('🔧 Banco sincronizado'))
  .catch(err => console.error(err));
