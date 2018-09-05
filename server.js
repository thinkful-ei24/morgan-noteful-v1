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

// Log all incoming requests
app.use(logger);

// Serve public files
app.use('/', express.static('public'));

// Parse incoming JSON
app.use(express.json());

// Add /notes/ endpoints
app.get('/api/notes', (req, res, next) => {
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

app.get('/api/notes/:id', (req, res, next) => {
  // fetch the ID of the requested item
  const id = req.params.id;
  // Locate the item in our database
  notes.find(id, (err, item) => {
    // Throw any errors
    if (err) next(err);
    // If item is found, respond to request
    else if (item !== undefined) res.json(item);
    // Otherwise, return 404
    else next();
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  // grab the ID from the request
  const id = req.params.id;
  // Create the object which will update our DB
  const updateObj = {};
  // Set the legal update fields
  const updateFields = ['title', 'content'];
  // Iterate through legal update fields
  updateFields.forEach(field => {
    // If the field is in our request
    if (field in req.body) {
      // Push the value of the field into our update obj
      updateObj[field] = req.body[field];
    }
  });
  console.log(updateObj);
  // update the DB with user input
  notes.update(id, updateObj, (err, item) => {
    if (err) next(err);
    else if (item !== undefined) res.json(item);
    else next();
  });
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