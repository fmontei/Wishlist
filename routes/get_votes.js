var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var wish_id = req.query.wish_id,
	user_id = req.query.user_id
    	
	console.log("wish_id " + wish_id)
	console.log("user_id " + user_id)
	query = "select * from vote where "
	if(user_id && wish_id){
		query += "wish_id = $wish_id and user_id = user_id;"
	} else if(user_id) {
		query += "user_id = $user_id;"
	} else {
		query += "wish_id = $wish_id;"
	}
	console.log(query)
   	async.waterfall([
   		function get_user(callback) {
   			db.all(query, {
				$user_id: user_id,
   				$wish_id: wish_id
		    }, function(err, rows) {
			console.log(err)
		    	if (rows) {
				console.log("THERE WERE ROWS")
				console.log(rows)
				votes = rows;
			}
		    	callback(err);
		    });
   		},
   	], function(err) {
   		if (err) {
   			return res.status(500).send(err);
   		} else {
   			return res.status(200).send(votes);
   		}
   	});
});

module.exports = router;
