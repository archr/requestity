var Connection = require('./connection');

function Requestity () {
  this.connections = {};
}

Requestity.prototype.configure = function (name, opts) {
  var conn = new Connection(opts);
  this.connections[name] = conn;

  return conn;
};

Requestity.prototype.connection = function (name) {
  return this.connections[name];
};

module.exports = exports = new Requestity();