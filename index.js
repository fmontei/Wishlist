require('dotenv').load();

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require('request');

var init_db = require('./scripts/init_db');
var get_or_create_user = require('./routes/get_or_create_user');
var create_wish = require('./routes/create_wish');
var get_wish = require('./routes/get_wish');
var vote = require('./routes/vote');
var get_vote = require('./routes/get_votes');
var get_default_users = require('./routes/get_default_users');
var update_status = require('./routes/update_wish_status');
var update_crowd_fund = require('./routes/update_crowd_fund');

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
app.get('/get_wish', get_wish);
app.get('/get_vote', get_vote);
app.post('/get_or_create_user', get_or_create_user);
app.post('/create_wish', create_wish);
app.post('/vote', vote);
app.get('/get_default_users', get_default_users);
app.post('/status', update_status);
app.post('/crowd_fund', update_crowd_fund);

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

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
