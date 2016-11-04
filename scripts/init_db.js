var express = require('express');
var async = require('async');
var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var db = new sqlite3.Database(process.env.DB_NAME);

var create_user_table_stmt = "create table if not exists user(" +
	"user_id integer primary key autoincrement not null," +
	"firstname varchar(30)," +
	"lastname varchar(30)," +
	"attuid varchar(30) not null unique on conflict ignore," +
	"password varchar(30) not null," +
	"supervisor_id integer," +
	"foreign key (supervisor_id) references user(user_id) on update cascade);";

var create_user_prototype_table_stmt = "create table if not exists " +
	"user_prototype(attuid varchar(30) not null unique on conflict ignore);";

var create_tables = function() {
	var deferred = Q.defer();

	async.parallel([
	    function(callback) {
			db.run(create_user_table_stmt, function(err) {
				callback(err);
			});
		},
		function(callback) {
			db.run(create_user_prototype_table_stmt, function(err) {
				callback(err);
			});
		}
	], function(err) {
		deferred.resolve(err);
	});

	return deferred.promise;
};

var insert_into_tables = function() {
	var deferred = Q.defer();
	var insert_user_statements = create_user_prototypes();
	console.log(insert_user_statements);

	async.map(
		insert_user_statements,
		function(statement, map_callback) {
			async.parallel([
				function(parallel_callback) {
					db.run(statement, function(err) {
						parallel_callback(err);
					});
				}
			], function(err) {
				map_callback(err);
			});
		},
		function(err, result) {
			deferred.resolve(err);
		}
	);

	return deferred.promise;
}

function create_user_prototypes() {
	var insert_user_statements = [];
	var user_attuids = ["fm577c", "js802v", "yh128t", "yh418t", "dp612u"];
	for (var i = 0; i < user_attuids.length; i++) {
		insert_user_statements.push("insert into user_prototype(attuid) " +
			"values('" + user_attuids[i] + "');");
	}
	return insert_user_statements;
}

router.use(function(req, res, next) {
	function throw_500(err) {
		res.status(500).send("Error initializing DB: " + err + ".");
	}

	create_tables().then(function(err) {
		if (err) throw_500(err);
		else return insert_into_tables();
	}).then(function(err) {
		if (err) throw_500(err);
		else res.status(200).send("Successfully initialized DB.");
	});
});

module.exports = router;
