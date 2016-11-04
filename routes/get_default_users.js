var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    users = []
   	async.waterfall([
   		function get_user_list(callback) {
   			db.all("select * from user_prototype order by attuid asc;", 
          function(err, rows) {
		    	  if (rows) users = rows;
		    	  callback(err);
		    });
   		}
   	], function(err) {
   		if (err) {
   			return res.status(500).send(err.message);
   		} else {
   			return res.status(200).send(users);
   		}
   	});
});

module.exports = router;