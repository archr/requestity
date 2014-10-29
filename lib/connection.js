var fs = require('fs');
var path = require('path');
var request = require('superagent');
var Schema = require('./schema');
var debug = require('debug')('requestity:connections');

function Connection (opts) {
  this.schemas = {};

  this.name = opts.name;
  this.schemaDir = opts.schemaDir || null;

  // Es la base que con la que se inicializa cada Schema
  this.base = {
    url: opts.baseUrl  || '',
    method: opts.method || 'GET',
    headers: opts.headers || {}
  }

  this.loadSchemas(this.schemaDir);
}

/**
 * Carga los schemas que esten en el directorio
 * @param  {String} dir ubicación completa del directorio
 *
 */

Connection.prototype.loadSchemas = function (dir) {
  var files = fs.readdirSync(dir);

  for (var i = 0; i < files.length; i++) {
    var file =  path.resolve(dir, files[i]);

    if (fs.statSync(file).isDirectory()) {
      this.loadSchemas(file);
    }else {
      var schema = this.parseSchema(file);
      if (schema) {
        this.schemas[schema.name] = schema;
      }
    }
  }
};

/**
 * Parsea schemas validos
 * @param  {String} ruta completa del arhivo
 *
 */

Connection.prototype.parseSchema = function (file) {
  var json;

  try {
    json = require(file);
  } catch (e) {
    return false;
  }

  return new Schema(json, this.base);
};

Connection.prototype.go = function (name, params, callback) {
  var nameSchema = name;
  var urlParams = false;

  if (typeof name == 'object') {
    nameSchema = name.name;
    urlParams = name.params;
  }

  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  if (!this.schemas[nameSchema]) {
    return callback(new Error('Not found schema'));
  }

  var schema = this.schemas[nameSchema];

  var method = schema.method;
  var headers = schema.headers;
  var url = schema.generateUrl(urlParams);


  debug('url', url);
  debug('method', method);
  debug('headers', headers);

  var agent = request.agent();

  agent = agent[method](url).set(headers);

  if (method === 'post') {
    if (typeof params !== 'string') {
      params = schema.parseParams(params);
    }
    debug('params', params);
    agent = agent.send(params);
  }

  agent.end(function (err, res) {
    if (err) {
      debug('err', err);
      return callback(err);
    }

    if (res.error) {
      debug('res.error', res.error);
      return callback(res.error);
    }

    if (schema.parser) {
      debug('parser');
      return schema.parser(res, callback);
    }

    if (schema.parentNode) {
      debug('parentNode');
      var body = res.body;
      var parentNode = schema.parentNode.split('.');

      for (var i = 0; i < parentNode.length; i++) {
        body = body[parentNode[i]];
      }

      return callback(null, body);
    }

    return callback(null, res.body);
  });

};

module.exports = Connection;
