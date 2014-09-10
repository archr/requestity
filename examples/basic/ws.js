var app = require('express')();

app.get('/users1', function (req, res) {
  console.log('users1');
  res.json({
    path: 'users1'
  });
});


app.get('/users2', function (req, res) {
  res.json({
    path: 'users2'
  });
});

app.listen(4000, function (){
  console.log('server on port: 4000');
});
