var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var wish_id = req.body.wish_id,
	score = req.body.score
	wish = null
		
   	async.waterfall([
   		function get_user(callback) {
   			db.all('update wish set score = $score where wish_id = $wish_id;', {
   				$score: score,
				$wish_id: wish_id
		    }, function(err, rows) {
                        console.log(err)
		    	if (rows) {
				console.log("THERE WERE ROWS")
				console.log(rows)
				wish = rows;
			}
		    	callback(err);
		    });
   		},
   	], function(err, updated_item_id) {
        	if (!err) {
            		res.status(200).send({last_id: updated_item_id});
        	} else {
        	    	res.status(501).send(err);
        	}
    	})
});

module.exports = router;
