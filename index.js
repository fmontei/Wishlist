require('dotenv').load();

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require('request');

var init_db = require('./scripts/init_db');
var get_or_create_user = require('./routes/get_or_create_user');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',
    		   'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/init', init_db);
app.post('/get_or_create_user', get_or_create_user);

request({
    url: 'http://localhost:' + (process.env.PORT || 3000) + '/init',
    method: 'GET'
}, function(error, response, body) {
	console.log(error + " " + body);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + (process.env.PORT || 3000));
});
