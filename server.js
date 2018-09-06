const {PORT} = require('./config');
const morgan = require('morgan');
const notesRouter = require('./router/notes.router');


// Initialize an express app
const express = require('express');
const app = express();

// Log all incoming requests
app.use(morgan('dev'));

// Serve public files
app.use('/', express.static('public'));

// Handle /api/items routes
app.use('/api/notes', notesRouter);

// Handle invalid requests
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  // Send invalid request to next error handler
  next(err);
});

// Respond to all errors
app.use((err, req, res, next) => {
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