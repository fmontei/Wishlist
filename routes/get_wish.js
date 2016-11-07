var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var wishes = []
   	async.waterfall([
   		function get_user(callback) {
   			db.all('select * from wish;', {
		    }, function(err, rows) {
		    	if (rows) {
				    //console.log("THERE WERE WISHES")
				    //console.log(rows)
				    wishes = rows;
			    }
		    	callback(err);
		    });
   		},
        function get_vote_count(callback) {
            for(i in wishes) {
                var wish = wishes[i];
                db.all("select * from vote where wish_id=" + wish.wish_id, {
                }, function(err, rows) {
                    if (rows) {
                        //console.log("THERE WERE VOTES");
                        //console.log(rows)
                        wish.score = rows.length;
                    }
                    callback(err);
                });
            }
        }
   	], function(err) {
   		if (err) {
   			return res.status(500).send(err);
   		} else {
   			return res.status(200).send(wishes);
   		}
   	});
});

module.exports = router;
