'use strict';

// Load array of notes
const data = require('./db/notes');

// Initialize an express app
const express = require('express');
const app = express();

// Serve public files
app.use('/', express.static('public'));

// Add API endpoints
app.get('/api/notes', (req, res) => {
  res.json(data);
});


// Spin up static server
app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', e => console.error(e));