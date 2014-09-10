var chai = require('chai');
var path = require('path');
var requestity = require('..');
var app = require('./server');

var api;

chai.should();
app.listen(3000);

describe('#requestity', function () {
  api = requestity.configure('api', {
    name: 'api',
    baseUrl: 'http://localhost:3000',
    method: 'GET',
    headers: {
      'Acccept': 'Application/json'
    },
    schemaDir: path.resolve(__dirname, './fixtures')
  });


  it('should configure api', function (){
    api.name.should.equal('api');
  });

  it('should return a error when no exists schema', function (done){
    api.go('foo', {}, function (err, result) {
      err.should.exist;
      done();
    });
  });

  it('should create a correct request', function (done){
    api.go('bar', function (err, result) {
      result.users.should.exist;
      done();
    });
  });


});

