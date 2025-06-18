const bcrypt = require('bcrypt');

const password = 'admin'; // ou a senha que quiser
bcrypt.hash(password, 10).then(hash => {
  console.log('Senha hash:', hash);
});