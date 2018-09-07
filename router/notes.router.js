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
  notes.filter(searchTerm)
    .then(list => res.json(list))
    .catch(err => next(err));
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
  notes.create(content)
    .then(item => res.status(201).json(item))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  // fetch the ID of the requested item
  const id = req.params.id;
  // Locate the item in our database
  notes.find(id)
    .then(item => {
      // If item is found, respond to request
      if (item !== undefined) res.json(item);
      // Otherwise, return 404
      else next();
    })
    .catch(err => next(err));
});

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
  notes.update(id, updateObj)
    .then(item => res.status(200).json(item))
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then((len) => {
      if (len !== null) res.status(204).end();
      else next();
    })
    .catch(err => next(err));
});

module.exports = router;