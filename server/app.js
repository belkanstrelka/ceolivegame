const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser')
const compression = require('compression')

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const app = next({ dir: '.', dev });
const handle = routes.getRequestHandler(app);

// пользователь регистрируется

app.prepare().then(() => {
  const server = express();

  server.use(compression())
  server.use(bodyParser.json())
  server.use(express.static(__dirname + '/static'));

  server.use('/api/v1/chapters', chaptersRouter);
  server.use('/api/v1/tasks', briefRouter);
  server.use('/api/v1/cashGates', briefRouter);
  server.use('/api/v1/channels', briefRouter);
  server.use('/api/v1/campaigns', briefRouter);

  server.listen(PORT, (err) => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
