var requestify = require('../..');
var ws = requestify.connection('ws');

module.exports = function (app) {
  app.get('/foo', function (req, res){
    ws.go('users1', function (err, data){
      res.send(data);
    });
  });
};