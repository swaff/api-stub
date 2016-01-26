window.INTERCEPT = {};

INTERCEPT.createEntry = function (file, code) {
    return {
        response_file: file,
        response_code: code
    };
};

INTERCEPT.getCustomResponses = function () {
    var responses = localStorage.getItem('custom-responses');
    return responses ? JSON.parse(responses) : {};
};

INTERCEPT.saveCustomResponses = function (responses) {
    localStorage.setItem('custom-responses', JSON.stringify(responses));
};

INTERCEPT.addEntry= function (path, file, code) {
    var customResponses = INTERCEPT.getCustomResponses();

    if (!customResponses.hasOwnProperty(path)) {
        customResponses[path] = [];
    }
    customResponses[path].unshift(INTERCEPT.createEntry(file, code));

    INTERCEPT.saveCustomResponses(customResponses);
};

/*
 *
 *
 * This needs to handle URLs that already have query args
 *
 *
 */
INTERCEPT.entryToParams = function (entry) {
    return '?' + Object.keys(entry).map(function (key) {
        return key + '=' + entry[key]
    }).join('&');
};

INTERCEPT.getEntryForPath = function (path) {
    var responses = INTERCEPT.getCustomResponses();
    if (responses[path]) {
        var entry = responses[path].pop();
        INTERCEPT.saveCustomResponses(responses);
        return entry;
    }
};

INTERCEPT.proxyXhrOpen = function () {
    var original = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        var args = [].slice.call(arguments);
        var path = args[1];

        var entry = INTERCEPT.getEntryForPath(path);

        if (entry) {
            path = path + INTERCEPT.entryToParams(entry);
        }

        args[1] = path;
        return original.apply(this, args);
    };
};


INTERCEPT.init = function () {
  localStorage.removeItem('custom-responses');
  INTERCEPT.proxyXhrOpen();
};
