var app = require('express')();
var bodyParser = require('body-parser');

function Server () {

  app.use(bodyParser.json());

  app.post('/users', function (req, res){
    res.json({
      success: true,
      data: {
        users: ['antonio']
      }
    });
  });

  app.post('/users/1', function (req, res) {
    res.json({
      success: true,
      user: {
        username: 'archr'
      }
    });
  });

  app.post('*', function (req, res){
    res.json(req.body);
  });
}

Server.prototype.listen = function (port) {
  app.listen(port, function () {
    console.log('server listening on port ' + port);
  });
};

module.exports = new Server();