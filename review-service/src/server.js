require('dotenv').config();
const app = require('./app');
const connectMongo = require('./lib/mongo');

const PORT = process.env.PORT || 5002;

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Review service listening on port ${PORT}`));
});
