// Express Server Entry Point
const app = require('./app');
require('dotenv').config();

// read port from env variable, uses 5000 if not set
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});