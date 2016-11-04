# Wishlist API

## Before cloning the repo:

* Install Node.js https://nodejs.org
* `npm install -g bower grunt-cli`

## Initialize DB:
* node scripts/init_node.js

## Initialize Project:
* curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
* sudo apt-get install -y nodejs
* sudo apt-get install -y build-essential
* sudo apt-get update
* sudo apt-get install npm sqlite3 libsqlite3-dev
* sudo npm install -g grunt-cli bower sqlite3

## Every time you pull changes:

* `npm install`
* `bower install`
* `grunt` 

## Structure

* `public/`: Static files such as JavaScript, images, CSS, fonts, etc. Files
  in this directory are available at `/static/` client-side.
  * `lib/`: 3rd-party library files. This folder should be modified only
    by `Gruntfile.js`, which is executed using `grunt` and copies the necessary
    files from `bower_components`.
* `routes/`: Instead of assigning all routes in `index.js`, create a route
for each part of the application in separate files here and then
mount them in `index.js`.
* `scripts/`: Database utilities.

## Misc

### Endpoints

/get_wish 

/create_wish data:name&imageUrl&url&cost&category&reason&description&requester

/vote data:wish_id=<wish_id>&user_id=<user_id>&vote=<0 or 1>
/get_votes?wish_id=<wish_id>&user_id=<user_id>

/status_update data:wish_id=<wish_id>&new_status=<new_status>&comments=<comments>

/crowd_fund data:wish_id=<wish_id>&contribution=<$$$$$$$$>

### Adding packages

* Pass the `-S` flag to `npm install ...` to save the package as an application
  dependency in `package.json`.
* Pass the `-D` flag to `npm install ...` to save the package as a development
  dependency in `package.json` (e.g., grunt modules).
