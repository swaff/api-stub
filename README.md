# API Stub

This is an idea that aims to allow for easier acceptance testing of a single page application.

It aims to provide a stub of the applications api layer by matching requests to known JSON responses.

In it's simplest form:

`GET /user/test`

would return the JSON file found in the folder 

`api/user/test` with a `200` response code.

In addition query string arguments can be used to increase the depth of the file path. For example:

`GET /user/test?animal=turtle`

would map to a JSON file at 

`/api/user/test/params/animal-turtle`

### Further Customisations

When a response is not a simple 200 that maps to the directory specified by the request path the response can be customised by injecting data into local storage.

A response_code and response_file can be added which will then be reflected in the response.

If an entry is added in local storage like:

```JSON
{
    '/user/test': [{
        response_file: 'not-test',
        response_code: 201
    }]
}
```

then next time a request is intended for `/user/test`, a request will actually be made to

`/user/test?response_code=201&response_file=not-test`

therefore returning a 201 response containing the JSON found at 

`/api/user/not-test.json`

## XHR Interceptor

To help this there is a JavaScript file that needs to be loaded into the application under test that will proxy the open method of the XMLHttpRequest object and modify the request based on custom requirements in local storage.
