var MongoClient = require('mongodb').MongoClient;
//var db;
var connected = false;
var moongodbUrl = "mongodb://root:rootcmpe277db@ds133311.mlab.com:33311/cmpe277db";
var ObjectID = require('mongodb').ObjectID;

/**
 * Connects to the MongoDB Database with the provided URL
 */
function connect(url, callback) {
	
	MongoClient.connect(url, function(err, _db) {
		if (err) {
			throw new Error('Could not connect: ' + err);
		}
		//db = _db;
		connected = true;
		console.log(connected + " is connected?");
		callback(_db);
	});
}

/**
 * Returns the collection on the selected database
 */
function getcollection( name , callback) {
	if (!connected) {
		throw new Error('Must connect to Mongo before calling "collection"');
	}
	if(!global.db){

		console.log("DB not initialized!!") ;
	}
	callback( global.db.collection(name) )

}

function closeConn() {
	console.log("Closing db connection");
	global.db.close();
}

exports.connect = connect;
exports.getcollection = getcollection;
exports.closeConn = closeConn;