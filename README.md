# requestity

## Motivación
Despúes de tener que consumir suficientes web services de terceros que cambian constatemente durante su fase de desarrollo decidi generar una libreria donde a partir de objectos json/js se puedan generar todas las peticiones requeridas.

## Pros

- Escalable: Se pueden generar mas esquemas y hacer debugging no sera un problema
- Versionado: Se pueden tener diferentes versiones de los esquemas sin dolores de cabeza.


## Instalación

```shell
npm install requestity
```

## Uso

### json - js - schema

Los esquemas pueden ser .json o .js que tendran una estructura parecida a esta:

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

### Conexiónes

Puedes definir una o mas conexiones:

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