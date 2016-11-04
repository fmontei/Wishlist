var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var name = req.query.name,
	cost = req.query.cost,
	category = req.query.category,
	reason = req.query.reason,
	description = req.query.description,
	requester = req.query.requester,
    	wish = null;
    	
   	async.waterfall([
   		function get_user(callback) {
   			db.all('select * from wish where name = $name;', {
   				$name: name
		    }, function(err, rows) {
		    	if (rows) {
				console.log("THERE WERE ROWS")
				console.log(rows)
				wish = rows;
			}
		    	callback(err);
		    });
   		},
   	], function(err) {
   		if (err) {
   			return res.status(500).send(err);
   		} else {
   			return res.status(200).send(wish);
   		}
   	});
});

module.exports = router;