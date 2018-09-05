const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// POST (Create) Notes with Content Obj
const contentObj = {
  title: 'A Title',
  content: 'Some content.'
};

notes.create(contentObj, (err, item) => {
  if (err) console.error(err);
  else if (item) console.log(item);
  else console.log('not found');
});

// DELETE 
notes.delete(1005, (err, len) => {
  if (err) console.error(err);
  else if (len) console.log(`Removed ${len} item`);
  else console.log('does not exist');
});