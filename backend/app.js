const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const products = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/products', products);


app.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = app;