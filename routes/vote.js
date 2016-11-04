var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var user_id = req.body.user_id,
    	wish_id = req.body.wish_id,
	voted = req.body.voted
	console.log('HELLO')
	console.log(user_id + ' ' + wish_id)
    	
   	async.waterfall([
		function delete_because_david_sucks_at_sql(callback) {
                        db.run('delete from vote'+
                   ' where $user_id = user_id and $wish_id = wish_id;', {
                $user_id: user_id,
                $wish_id: wish_id
            }, function(err) {
                console.log(err)
                callback(err);
            });
                },
   		function create_user_if_not_exists(callback) {
   			db.run('insert into vote(user_id, wish_id, voted)'+ 
                   'select $user_id, $wish_id, $voted', {
		$user_id: user_id,
		$wish_id: wish_id,
		$voted: voted,
            }, function(err) {
		console.log(err)
            	callback(err);
            });
   		},
   		function get_user(callback) {
   			db.all('select * from vote where user_id = $user_id and wish_id = $wish_id;', {
   				$user_id: user_id,
				$wish_id: wish_id
		    }, function(err, rows) {
		    	if (rows) vote = rows[0];
		    	callback(err);
		    });
   		}
   	], function(err) {
   		if (err) {
			console.log(err)
   			return res.status(500).send(err);
   		} else {
   			return res.status(200).send(vote);
   		}
   	});
});

module.exports = router;
