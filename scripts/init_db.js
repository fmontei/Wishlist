var express = require('express');
var async = require('async');
var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var db = new sqlite3.Database(process.env.DB_NAME);

var create_user_table_statement = "create table if not exists user(" +
	"user_id integer primary key autoincrement not null," +
	"firstname varchar(30)," +
	"lastname varchar(30)," +
	"attuid varchar(30) not null," +
	"password varchar(30) not null," +
	"supervisor_id integer," +
	"foreign key (supervisor_id) references user(user_id) on update cascade);";

var init = function() {
	var deferred = Q.defer();
	
	async.waterfall([
	    function(callback) {
			db.run(create_user_table_statement, function(err) {
				callback(err);
			});
		},
	], function(err) {
		deferred.resolve(err);
	});

	return deferred.promise;
};

router.use(function(req, res, next) {
	init().then(function(err) {
		if (err) {
			res.status(500).send("Error initializing DB: " + err + ".");
		} else {
			res.status(200).send("Successfully initialized DB.");
		}
	});
});

module.exports = router;
