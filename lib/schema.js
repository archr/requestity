function Schema (json, file) {
  this.file = file;
  this.headers = {};
  this.init(json);
}

Schema.prototype.init = function (json) {
  for (var property in json) {
    this[property] = json[property];
  }

  if (!json.name) {
    var name = this.file.split('/');
    this.name = name[name.length - 1].replace('.json', '');
  }
};

module.exports = Schema;