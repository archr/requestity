### requestity

> Request with json configurations

## Instalation

```shell
npm install requestity
```

## Overview

### json - schema

Schemas are defined  as:

```json
{
  "name": "users",
  "method": "POST",
  "path": "/users",
  "params": {
    "foo": "string",
    "bar": {
      "type": "string",
      "required": true
    },
    "baz": {
      "type": "boolean",
      "default": false
    }
  },
  "parentNode": "data"
}
```

### connections

You can define one or more connections to endpoints.

```js
var request = requre('requestity');

var webserver1 = request.configure('webserver1', {
  name: 'webserver1'
  baseUrl: "http:localhost:3000/api",
  schemaDir: '/path/to/schemas',
  method: 'POST',
  headers: {
    'Accept': 'application/json'
  },
  parentNode: 'response'
});

var webserver2 = request.configure('webserver2', {
  name: 'webserver2'
  schemaDir: '/path/to/schemas',
  url: "http://example.com"
})

webserver1.go('users', function (err, res){

});

webserver2.go('client', {id: 1234}, function (err, res) {

});
```