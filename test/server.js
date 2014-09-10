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
}

Server.prototype.listen = function (port) {
  app.listen(port, function () {
    console.log('server listening on port ' + port);
  });
};

module.exports = new Server();