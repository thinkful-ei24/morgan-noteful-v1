'use strict';
const {logger} = require('./middleware/logger');
const {PORT} = require('./config');

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB'); 
const notes = simDB.initialize(data);

// Initialize an express app
const express = require('express');
const app = express();

// Serve public files
app.use('/', express.static('public'));

// Log all incoming requests
app.use(logger);

// Add /notes/ endpoints
app.get('/api/notes', (req, res) => {
  // Fetch searchTerm query from client request
  const {searchTerm} = req.query;
  // Check if a search was requested
  notes.filter(searchTerm, (err, list) => {
    // Throw any errors
    if (err) next(err);
    // Send a response if no errors
    else res.json(list);
  });
});

app.get('/api/notes/:id', (req, res) => {
  // fetch the ID of the requested item
  const id = Number(req.params.id);
  // Locate the item in our database
  for (const item of data) {
    // If found, return item obj in response
    if (item.id === id) return res.json(item);
  }
  // If not found, return 404 status
  return res.sendStatus(404);
});

// Handle invalid requests
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Send all error responses
app.use(function (err, req, res, next) {
  res.status(err.status || 500); 
  res.json({
    message: err.message,
    error: err
  });
});

// Spin up static server
app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', e => console.error(e));