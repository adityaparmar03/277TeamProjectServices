var mongo = require("./mongo");


//Method to add existing user as friend 
exports.addFrndForExistingUser = function(req, res){
	console.log("In friend.js : addFrndForExistingUser : Sending friend request to person! " + JSON.stringify(req.body)) ;
	var data = req.body ;
	var requester =  data.requester;
	var to_be_friend = data.to_be_friend ;
	

	global.db.collection( 'fbdroid', function (err, collection) {
		if(err){
			console.log("In friend.js : addFrndForExistingUser : No such collection exists" + JSON.stringify(err));
		}
		else{
			
			collection.updateOne( {'emailid' : requester.emailid } , { $addToSet : { "sent_req" :  to_be_friend  } }, function(err , results){
				if(err){

					console.log("In friend.js : addFrndForExistingUser :  Error while adding friend Id in sent_req array ")
					throw err;
				}else {

					//console.log ("In friend.js : Modified records : " + results.modifiedCount ) ; 
					console.log("Added in sent request array");

					collection.updateOne( {'emailid' : to_be_friend.emailid } , { $addToSet : {"pending_req" :  requester  } }, function(err , results){

						if(err){
							console.log("In friend.js : addFrndForExistingUser :  Error while adding friend Id in pending_req array ")
							throw err;
						}else{

							console.log("In friend.js : addFrndForExistingUser : Added in pending request array");
							res.json({'status': '200', 'msg': 'friend request added successfully'});
						}
					});	

				}

			}) ;
		}
	});
	
}


//Method to add existing user as friend 
exports.addFrndForExistingUser = function(req, res){
	console.log("In friend.js : addFrndForExistingUser : Sending friend request to person! " + JSON.stringify(req.body)) ;
	var data = req.body ;
	var requester =  data.requester;
	var to_be_friend = data.to_be_friend ;
	

	global.db.collection( 'fbdroid', function (err, collection) {
		if(err){
			console.log("In friend.js : addFrndForExistingUser : No such collection exists" + JSON.stringify(err));
		}
		else{
			
			collection.updateOne( {'emailid' : requester.emailid } , { $addToSet : { "sent_req" :  to_be_friend  } }, function(err , results){
				if(err){

					console.log("In friend.js : addFrndForExistingUser :  Error while adding friend Id in sent_req array ")
					throw err;
				}else {

					//console.log ("In friend.js : Modified records : " + results.modifiedCount ) ; 
					console.log("Added in sent request array");

					collection.updateOne( {'emailid' : to_be_friend.emailid } , { $addToSet : {"pending_req" :  requester  } }, function(err , results){

						if(err){
							console.log("In friend.js : addFrndForExistingUser :  Error while adding friend Id in pending_req array ")
							throw err;
						}else{

							console.log("In friend.js : addFrndForExistingUser : Added in pending request array");
							res.json({'status': '200', 'msg': 'friend request added successfully'});
						}
					});	

				}

			}) ;
		}
	});
	
}





exports.fetchPendingRequests = function(req,res) {

	var emailid = req.body.emailid ;

	console.log("In friend.js : fetchPendingRequests : Fectching pending requests") ;

	var searchCriteria = {

			'emailid' : emailid
	};

	global.db.collection('fbdroid', function (err, collection) {

		if (err) {


			console.log("In friend.js : fetchPendingRequests : Error while fetching the pending request!!") ;
			throw err;
		}else{



		}

	});


}
