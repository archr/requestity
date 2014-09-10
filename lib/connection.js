var fs = require('fs');
var path = require('path');
var request = require('superagent');
var Schema = require('./schema');
var debug = require('debug')('requestity:connections');

function Connection (opts) {
  this.name = opts.name;
  this.schemas = {};

  this.schemaDir = opts.schemaDir || null;
  this.baseUrl = opts.baseUrl  || '';
  this.method = opts.method || 'GET';
  this.headers = opts.headers || null;
  this.parentNode = opts.parentNode || '';

  this.loadSchemas(this.schemaDir);
}

Connection.prototype.loadSchemas = function (dir) {
  var files = fs.readdirSync(dir);

  for (var i = 0; i < files.length; i++) {
    var file =  path.resolve(dir, files[i]);

    if (fs.statSync(file).isDirectory()) {
      this.loadSchemas(file);
    }else {
      var schema = this.parseSchema(file);
      if (!schema) continue;
      this.schemas[schema.name] = schema;
    }
  }
};

Connection.prototype.parseSchema = function (file) {
  var json;

  try {
    json = require(file);
  } catch (e) {
    return false;
  }

  return new Schema(json, file);
};

Connection.prototype.go = function (name, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  if (!this.schemas[name]) {
    return callback(new Error('Not found schema'));
  }

  var schema = this.schemas[name];

  var method = schema.method || this.method;

  if(!method) {
    return callback(new Error('Not set method'));
  }
  method = method.toLowerCase();

  if(!this.baseUrl) {
    return callback(new Error('Not set baseUrl'));
  }

  var url = this.baseUrl + schema.path;
  var headers = this.headers || {};

  for (var header in schema.headers) {
    headers[header] = schema.headers[header];
  }

  debug('url', url);
  debug('method', method);
  debug('headers', headers);

  var agent = request.agent();

  agent = agent[method](url);
  agent = agent.set(headers);

  if (params) {
    debug('params', params);
    agent = agent.send(params);
  }

  agent.end(parser);

  function parser (err, res) {
    if (err) {
      return callback(err);
    }

    if (res.error) {
      return callback(res.error);
    }

    if (schema.parser) {
      debug('parser');
      return schema.parser(res, callback);
    } else if (schema.parentNode) {
      debug('parentNode');
      var body = res.body;
      var parentNode = schema.parentNode.split('.');

      for (var i = 0; i < parentNode.length; i++) {
        body = body[parentNode[i]];
      }

      return callback(null, body);
    } else {
      return callback(null, res.body);
    }
  }

};

module.exports = Connection;
