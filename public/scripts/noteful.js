/* global $ store api */

// eslint-disable-next-line
const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId, detailsResponse => {
        store.currentNote = detailsResponse;
        render();
      });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      api.search(store.currentSearchTerm, searchResponse => {
        store.notes = searchResponse;
        render();
      });

    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();
      const editForm = $(event.currentTarget);

      console.dir(event.currentTarget);

      const noteObj = {
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      noteObj.id = store.currentNote.id;

      if (noteObj.id !== undefined) {
        // Update the DB
        api.update(noteObj.id, noteObj, updateResponse => {
          store.currentNote = updateResponse;
          render();
        });
      }
      // if the note does not have an id
      else {
        api.create(noteObj, (res) => {
          store.currentNote = res;
          store.notes.push(res);
          render();
        });
      }

      
    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();

      store.currentNote = {};
      render();
    });
  }

  function handleNoteDeleteClick() {
    $('.js-notes-list').on('click', '.js-note-delete-button', (e) => {
      event.preventDefault();
      // Get ID of item clicked
      const id = $(e.target).parent('li').data('id');
      // update the DB
      api.remove(id, () => {
        // On success...
        // Find the item in the store
        const index = store.notes.findIndex(item => item.id === id);
        // Remove it from the store
        store.notes.splice(index, 1);
        // set correct currentNote state
        if (store.currentNote.id === id) store.currentNote = {};
        // Render new view
        render();
      });
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();

    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDeleteClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
