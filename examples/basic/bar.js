var requestify = require('../..');
var ws = requestify.connection('ws');

module.exports = function (app) {
  app.get('/bar', function (req, res){
    ws.go('users2', function (err, data){
      res.send(data);
    });
  });
};