var Schema = {
  'name': 'bar',
  'method': 'POST',
  'path' : '/users',
  'params': {
    'foo': 'string',
    'bar': {
      'type': 'string',
      'required': true
    },
    'baz' : {
      'type' : 'boolean',
      'default' : false
    }
  },
  parser: function (res, callback) {
    callback(null, res.body.data);
  }
};

module.exports = Schema;