const createServer = require('./server.js');

const PORT = 3000;

const app = createServer;

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`);
});