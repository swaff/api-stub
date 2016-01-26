window.APP = {};

APP.get = function (id) {
  return document.getElementById(id);
};

APP.submit = function (id, onsubmit) {
  APP.get(id).addEventListener('submit', onsubmit);
};

APP.click = function (id, onclick) {
  APP.get(id).addEventListener('click', onclick);
};

APP.getValue = function (id) {
  return APP.get(id).value;
};

APP.getTemplate = function (id) {
  return Handlebars.compile(APP.get(id).innerHTML);
}

APP.renderTemplate = function (templateId, data) {
  return APP.getTemplate(templateId + '-template')(data);
};

APP.getBooks = function () {
  APP.getJson('/api/books', function (data) {
      return APP.renderBooks(data.books);
  });
};

APP.renderBooks = function (books) {
  var outlet = document.getElementById('books');
  var ul = document.createElement('ul');
  books.forEach(function (book) {
    var renderedBook = APP.renderBook(book);
    ul.appendChild(renderedBook);
  });

  outlet.appendChild(ul);
};

APP.renderBook = function (book) {
  console.log('renderBook', book);
  var element = document.createElement('li');
  var bookTitle = document.createElement('div');
  bookTitle.innerText = book.title;
  bookTitle.addEventListener('click', function () {
    APP.getBookDetail(book);
  });
  element.appendChild(bookTitle);
  return element;
};

APP.renderTrackResponse = function (track) {
  var outlet = APP.get('track-responses');
  var output = APP.renderTemplate('track-response', track);
  outlet.innerHTML += output;
};

APP.renderBookDetail = function (book) {
  var detailOutlet = document.getElementById('book-detail');
  var output = APP.renderTemplate('book-detail', book);
  detailOutlet.innerHTML = output;
};

APP.getBookDetail = function (book) {
    var url = '/api/books/' + book.id;
    APP.getJson(url, function (book) {
        APP.renderBookDetail(book);
    });
};

APP.initPostsForm = function () {
    APP.submit('post-form', function (evt) {
        evt.preventDefault();
        INTERCEPT.addEntry(
            '/api/post/destination',
            APP.getValue('post-file'),
            APP.getValue('posts')
        );
        APP.post();
    });
};

APP.getJson = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        cb(JSON.parse(this.responseText));
    };
    xhr.send();
};

APP.post = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/post/destination', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        console.log(this.responseText);
    };
    xhr.send();
};

APP.makeTrackRequests = function () {
  APP.tracks.shift();
  APP.getJson('/api/tracks', function (track) {
    APP.renderTrackResponse(track);

    if (APP.tracks.length) {
      APP.makeTrackRequests();
    }
  });
};

APP.initTracksForm = function () {

    APP.submit('tracks-form', function (evt) {
        var filename = APP.getValue('request-file');
        evt.preventDefault();
        APP.tracks.push(filename);
        INTERCEPT.addEntry('/api/tracks', filename);
        APP.renderTrackRequests();
    });

    APP.click('clear-tracks', function () {
      APP.tracks = [];
      APP.get('track-responses').innerHTML = '';
      APP.renderTrackRequests();
    });

    APP.click('make-request', function () {

      APP.get('track-responses').innerHTML = '';
      APP.makeTrackRequests();
    });
};

APP.renderTrackRequests = function () {
  var trackOutlet = APP.get('queued-tracks');
  var output = APP.renderTemplate('tracks', { tracks: APP.tracks });
  trackOutlet.innerHTML = output;
};

APP.tracks = [];

APP.init = function () {
  APP.getBooks();
  APP.initTracksForm();
  APP.initPostsForm();
};
