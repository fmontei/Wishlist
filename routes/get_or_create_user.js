var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var attuid = req.body.attuid,
    	password = req.body.password,
    	user = null;
    	
   	async.waterfall([
   		function create_user_if_not_exists(callback) {
   			db.run("insert into user(attuid, password) values(" +
               "$attuid, $password);", {
                $attuid: attuid,
                $password: password
            }, function(err) {
            	callback(err);
            });
   		},
   		function get_user(callback) {
   			db.all("select * from user where attuid = $attuid and " +
   				     "password = $password;", {
   				$attuid: attuid,
   				$password: password
		    }, function(err, rows) {
		    	if (rows) user = rows[0];
		    	callback(err);
		    });
   		}
   	], function(err) {
   		if (err) {
   			return res.status(500).send(err.message);
   		} else {
   			return res.status(200).send(user);
   		}
   	});
});

module.exports = router;
