var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var router = express.Router();
var db = new sqlite3.Database('wishlist.db');


router.use(function(req, res, next) {
    var name = req.body.name,
    	imageUrl = req.body.imageUrl,
	url = req.body.url,
	cost = req.body.cost,
	category = req.body.category,
	reason = req.body.reason,
	description = req.body.description,
	requester = req.body.requester,
    	wish = null;
    	
   	async.waterfall([
   		function create_user_if_not_exists(callback) {
   			db.run('insert into wish(name, imageUrl, url, cost, category, reason, description, requester, crowd_source, score, status)'+ 
                   'select $name, $imageUrl, $url, $cost, $category, $reason, $description, $requester, $crowd_source, $score, $status', {
                $name: name,
                $imageUrl: imageUrl,
		$url: url,
		$cost: cost,
		$category: category,
		$reason: reason,
		$description: description,
		$requester: requester,	
		$crowd_source: 0,
		$score: 1,
		$status: 'pending'
            }, function(err) {
		console.log(err)
            	callback(err);
            });
   		},
   		function get_user(callback) {
   			db.all('select * from wish where name = $name;', {
   				$name: name
		    }, function(err, rows) {
		    	if (rows) wish = rows[0];
		    	callback(err);
		    });
   		}
   	], function(err) {
   		if (err) {
			console.log(err)
   			return res.status(500).send(err);
   		} else {
   			return res.status(200).send(wish);
   		}
   	});
});

module.exports = router;
