const express = require('express');

const server = express();

const middleware = require('./config/middleware')

// import routers

// third-party middleware
middleware(server);

// built in middleware
server.use(express.json()); // parses body

// routers - projects

server.get('/', (req, res) => {
  res.send(`<h2>Project Note App</h2>`)
});

module.exports = server;
