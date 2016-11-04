var express = require('express');
var async = require('async');
var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var db = new sqlite3.Database('wishlist.db');
var supervisor_id = null;

var create_user_table_stmt = "create table if not exists user(" +
    "user_id integer primary key autoincrement not null," +
    "firstname varchar(30)," +
    "lastname varchar(30)," +
    "attuid varchar(30) not null unique on conflict ignore," +
    "password varchar(30) not null," +
    "supervisor varchar(30) not null);";

var create_wish_table_statement = "create table if not exists wish(" +
	"wish_id integer primary key autoincrement not null," +
	"name varchar(100)," +
	"description varchar(500)," +
	"requester varchar(30) not null," +
        "imageUrl varchar(100)," +
	"url varchar(100)," +
	"comments varchar(500)," +
	"status varchar(100)," +
	"reason varchar(100)," +
	"category varchar(100)," +
	"cost float," +
        "score integer," + 
	"crowd_source float," + 
	"supervisor_id integer," +
	"foreign key (requester) references user(name) on update cascade);";

var create_vote_table_statement = "create table if not exists vote(" +
    "vote_id integer primary key autoincrement not null," +
    "user_id integer," +
    "wish_id integer," +
    "voted integer," +
    "foreign key (wish_id) references user(user_id) on update cascade);";

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
        },
        function(callback) {
            db.run(create_wish_table_statement, function(err) {
                callback(err);
            });
        },
        function(callback) {
            db.run(create_vote_table_statement, function(err) {
                callback(err);
            });
        },
    ], function(err) {
        deferred.resolve(err);
    });

    return deferred.promise;
};

var insert_into_tables = function() {
	var deferred = Q.defer();
	var insert_user_statements = get_user_prototype_statements();
	var insert_wish_statements = get_wish_statements();
	console.log(insert_user_statements);
	console.log(insert_wish_statements);
    var insert_statements = insert_user_statements.concat(insert_wish_statements);

	async.map(
		insert_statements,
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

function get_user_prototype_statements() {
    var insert_user_statements = [];
    var user_attuids = ["fm577c", "js802v", "yh128t", "yh418t", "dp612u",
                        "cs4944"];
    for (var i = 0; i < user_attuids.length; i++) {
        insert_user_statements.push(
            "insert or ignore into user_prototype(attuid) values('{0}');"
            .format(user_attuids[i], supervisor_id));
    }
    return insert_user_statements;
}

function get_wish_statements() {
    var insert_wish_statements = [];
    var wishes =  [{
			requester: 'js802v',
			name : 'Game Sphere',
			url : 'gamesphere.com',
			reason : 'no reason at all',
			status : 'pending', // admin can change to {'approved','rejected','crowd'}
			description : 'It\'\'s spherical!',
			imageUrl : 'https://media.tenor.co/images/04631b0f77251af5e7dafe0b3a061724/raw',
			comments : null, // to be filled out by admin upon status change,
			cost : 514.99,
			raised : 10.99,
			donated: false
		}, {
			requester : 'js802v',
			name : 'Rugrats Season 1 DVD',
			url : 'https://www.amazon.com/Rugrats-Season-Disc-Melanie-Chartoff/dp/B00264H48O',
			reason : 'Nostalgia feels',
			status : 'pending',
			description : 'What\'\'s better than a clean diapee and a fresh bottle? How about the first-ever, 25-episode, 4-disc set of the complete First Season of Rugrats! It\'\'s Tommy, Angelica, Chuckie and the rest of the gang, taking you on adventures from the ground up.',
			imageUrl : 'https://images-na.ssl-images-amazon.com/images/I/51GaL5wlh8L.jpg',
			comments : null,
			cost : 13.29,
            raised: 0
		}, {
			requester : 'js802v',
			name : 'Red Swingline Stapler',
			url : 'http://www.thinkgeek.com/product/61b7/',
			reason : 'Excuse me, I believe you have my stapler...',
			status : 'rejected', // admin can change to {'approved','rejected','crowd'}
			description : 'People sometimes form very strong bonds to inanimate objects. This is especially the case when you come into daily contact with, say, a red Swingline stapler.',
			imageUrl : 'http://www.thinkgeek.com/images/products/frontsquare/61b7_swingline_stapler.jpg',
            comments: null,
			cost : 24.99,
            raised: 0
		}, {
			requester : 'yh128t',
			name : 'Pumpkins',
			url : 'pumpkins.com',
			reason : 'I\'\'m hungry',
			status : 'approved', // admin can change to {'approved','rejected','crowd'}
			description : 'Pumpkins are so yummy!',
			imageUrl : 'http://healthyrise.com/wp-content/uploads/2016/09/Pumpkin-5.gif',
			comments : null, // to be filled out by admin upon status change
            raised: 0,
			cost : 14.99
		}, {
			requester : 'yh128t',
			name : 'Pumpkins',
			url : 'pumpkins.com',
			reason : 'I\'\'m hungry',
			status : 'crowd', // admin can change to {'approved','rejected','crowd'}
			description : 'Pumpkins are so yummy!',
			imageUrl : 'http://healthyrise.com/wp-content/uploads/2016/09/Pumpkin-5.gif',
			comments : null, // to be filled out by admin upon status change
			cost : 14.99,
			raised : 10.99,
		}];
	for (i in wishes){
        wish = wishes[i];
        statement = "insert into wish(" +
            "requester, name, url, reason, status, description, imageUrl, cost, crowd_source) " +
            "values('" + wish.requester + "'," +
            "'" + wish.name + "'," +
            "'" + wish.url + "'," +
            "'" + wish.reason + "'," +
            "'" + wish.status + "'," +
            "'" + wish.description + "'," +
            "'" + wish.imageUrl + "'," +
            wish.cost + "," +
            wish.raised + ");";
        insert_wish_statements.push(statement);
	}
	return insert_wish_statements;
}

function create_wishes() {
    var insert_wish_statements = [];
    var wishes =  [{
			requester: 'js802v',
			name : 'Game Sphere',
			url : 'gamesphere.com',
			reason : 'no reason at all',
			status : 'pending', // admin can change to {'approved','rejected','crowd'}
			description : 'It\'\'s spherical!',
			imageUrl : 'https://media.tenor.co/images/04631b0f77251af5e7dafe0b3a061724/raw',
			comments : null, // to be filled out by admin upon status change,
			cost : 514.99,
			raised : 10.99,
			donated: false
		}, {
			requester : 'js802v',
			name : 'Rugrats Season 1 DVD',
			url : 'https://www.amazon.com/Rugrats-Season-Disc-Melanie-Chartoff/dp/B00264H48O',
			reason : 'Nostalgia feels',
			status : 'pending',
			description : 'What\'\'s better than a clean diapee and a fresh bottle? How about the first-ever, 25-episode, 4-disc set of the complete First Season of Rugrats! It\'\'s Tommy, Angelica, Chuckie and the rest of the gang, taking you on adventures from the ground up.',
			imageUrl : 'https://images-na.ssl-images-amazon.com/images/I/51GaL5wlh8L.jpg',
			comments : null,
			cost : 13.29,
            raised: 0
		}, {
			requester : 'js802v',
			name : 'Red Swingline Stapler',
			url : 'http://www.thinkgeek.com/product/61b7/',
			reason : 'Excuse me, I believe you have my stapler...',
			status : 'rejected', // admin can change to {'approved','rejected','crowd'}
			description : 'People sometimes form very strong bonds to inanimate objects. This is especially the case when you come into daily contact with, say, a red Swingline stapler.',
			imageUrl : 'http://www.thinkgeek.com/images/products/frontsquare/61b7_swingline_stapler.jpg',
            comments: null,
			cost : 24.99,
            raised: 0
		}, {
			requester : 'yh128t',
			name : 'Pumpkins',
			url : 'pumpkins.com',
			reason : 'I\'\'m hungry',
			status : 'approved', // admin can change to {'approved','rejected','crowd'}
			description : 'Pumpkins are so yummy!',
			imageUrl : 'http://healthyrise.com/wp-content/uploads/2016/09/Pumpkin-5.gif',
			comments : null, // to be filled out by admin upon status change
            raised: 0,
			cost : 14.99
		}, {
			requester : 'yh128t',
			name : 'Pumpkins',
			url : 'pumpkins.com',
			reason : 'I\'\'m hungry',
			status : 'crowd', // admin can change to {'approved','rejected','crowd'}
			description : 'Pumpkins are so yummy!',
			imageUrl : 'http://healthyrise.com/wp-content/uploads/2016/09/Pumpkin-5.gif',
			comments : null, // to be filled out by admin upon status change
			cost : 14.99,
			raised : 10.99,
		}];
	for (i in wishes){
        wish = wishes[i];
        statement = "insert into wish(" +
            "requester, name, url, reason, status, description, imageUrl, cost, crowd_source) " +
            "values('" + wish.requester + "'," +
            "'" + wish.name + "'," +
            "'" + wish.url + "'," +
            "'" + wish.reason + "'," +
            "'" + wish.status + "'," +
            "'" + wish.description + "'," +
            "'" + wish.imageUrl + "'," +
            wish.cost + "," +
            wish.raised + ");";
        insert_wish_statements.push(statement);
	}
	return insert_wish_statements;
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
