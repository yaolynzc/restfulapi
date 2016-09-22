var express = require('express');
var services = require('./routes/services');
var app = express();

app.get('/login/:uid/:pwd',services.login);
app.get('/register/:uid/:pwd',services.register);
app.get('/updateuser/',services.updateuser);

app.listen(8088);
console.log('rest api listening on port 8088');
