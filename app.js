const express = require('express');
const app = express();
require('dotenv').config();

// const name = require('./src/routes');
// app.use('/api', name);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
