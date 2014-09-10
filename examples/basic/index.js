var app = require('express')();
var requestity = require('../../');

requestity.configure('ws', {
  baseUrl: 'http://localhost:4000',
  schemaDir: __dirname + '/schemas'
});

require('./foo')(app);
require('./bar')(app);


app.listen(3000, function (){
  console.log('server on port: 3000');
});
