require('dotenv').config();
const app = require('./app');
const connectMongo = require('./lib/mongo');

const PORT = process.env.PORT || 5001;

connectMongo();

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
