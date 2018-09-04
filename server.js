'use strict';

// Load array of notes
const data = require('./db/notes');

// Initialize an express app
const express = require('express');
const app = express();

// Serve public files
app.use('/', express.static('public'));

// Add /notes/ endpoints
app.get('/api/notes', (req, res) => {
  res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  // fetch the ID of the requested student
  const id = Number(req.params.id);
  // Locate the student object in our database
  for (const student of data) {
    // If found, return entire student obj
    if (student.id === id) return res.json(student);
  }
  // If not found, return 404 status
  return res.sendStatus(404);
});


// Spin up static server
app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', e => console.error(e));