require('dotenv').config();

const server = require('./api/server');

const PORT = process.env.PORT || 9002;

const message = 'Server Running on http://localhost:';

const portAndMessage = `\n*** ${message} ${PORT} ***\n`;

// listening
server.listen(PORT, () => {
  console.log(portAndMessage);

});
