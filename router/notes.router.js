/* * * * * * * * * *
 * /NOTES/ ROUTER  *
 * * * * * * * * * */

const express = require('express');
const router = express.Router();

// Expose our notes DB interface
const data = require('../db/notes');
const notes = require('../db/simDB').initialize(data); 

// Parse incoming JSON
router.use(express.json());

router.get('/', (req, res, next) => {
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

router.post('/', (req, res, next) => {
  const content = {
    title: req.body.title,
    content: req.body.content,
  };
  if (!content.title) {
    const err = new Error('Title Required');
    err.status = 400;
    next(err);
  }
  notes.create(content, (err, item) => {
    if (err) next(err);
    else if (item !== undefined) res.json(item);
    else next();
  });
});

router.get('/:id', (req, res, next) => {
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

// Think about composing a function that returns a doctorObject() function
  // Think of composition as combining abilities
  // Factory function pattern?
router.put('/:id', (req, res, next) => {
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
  // update the DB with user input
  notes.update(id, updateObj, (err, item) => {
    if (err) next(err);
    else if (item !== undefined) res.json(item);
    else next();
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id, (err, len) => {
    if (err) next(err);
    else if (len !== null) res.status(204).end();
    else {
      next();
    }
  });
});


module.exports = router;