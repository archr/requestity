/**
 * Este es el schema que maneja cada peticion
 */

/**
 * Schema
 * @param {Object} json es el objecto que se obtiene de un .json o .js
 * @param {String} file nombre del archivo js*
 */
function Schema (json, base) {
  this.base = base;
  this.init(json);
}

/**
 * Genera cada una de las propiedades del schema
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
Schema.prototype.init = function (json) {
  for (var property in json) {
    this[property] = json[property];
  }

  if(!this['method']) {
    this.method = this.base.method;
  }
  this.method = this.method.toLowerCase();

  if(!this['headers']) {
    this.headers = this.base.headers;
  }
};

// Esto deberia general una url con los parametros que se le envien
// http://localhost/users/:userId -> http://localhost/users/1234
Schema.prototype.generateUrl = function (params) {
  var path = this.path;

  if(params) {
    for(var param in params) {
      var key = ':' + param;
      var value = params[param];
      path = path.replace(key, value);
    }
  }

  return this.base.url + path;
};


// Aqui se genera a partir de los parametros que se le envia:
// default
Schema.prototype.parseParams = function (params) {
  if(typeof params !== 'object') {
    params = {};
  }

  if(typeof this.params !== 'object') {
    this.params = {};
  }

  for (var key in this.params) {
    var param = this.params[key];
    if(typeof param === 'object') {
      if(param.default && !params[key]) {
        params[key] = param.default;
      }
    }
  }
  return params;
};

module.exports = Schema;