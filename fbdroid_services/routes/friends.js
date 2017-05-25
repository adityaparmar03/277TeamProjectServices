var mongo = require("./mongo");
var utils = require("./utils")


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
			
			collection.updateOne( {'emailid' : requester.emailid } , { $addToSet : { "sent_req" :  to_be_friend.emailid  } }, function(err , results){
				if(err){

					console.log("In friend.js : addFrndForExistingUser :  Error while adding friend Id in sent_req array ")
					throw err;
				}else {

					//console.log ("In friend.js : Modified records : " + results.modifiedCount ) ; 
					console.log("Added in sent request array");

					collection.updateOne( {'emailid' : to_be_friend.emailid } , { $addToSet : {"pending_req" :  requester.emailid  } }, function(err , results){

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



//Method to add new user as friend 
exports.addFrndForNewUser = function(req, res){
	console.log("In friend.js : addFrndForNewUser : Sending friend request to person! " + JSON.stringify(req.body)) ;
	var data = req.body ;
	var requester =  data.requester;
	var to_be_friend = data.to_be_friend ;
	

	global.db.collection( 'fbdroid', function (err, collection) {
		if(err){
			console.log("In friend.js : addFrndForNewUser : No such collection exists" + JSON.stringify(err));
		}
		else{
			
			collection.updateOne( {'emailid' : requester.emailid } , { $addToSet : { "sent_req" :  to_be_friend.emailid  } }, function(err , results){
				if(err){

					console.log("In friend.js : addFrndForNewUser :  Error while adding friend Id in sent_req array ")
					throw err;
				}else {

					//console.log ("In friend.js : Modified records : " + results.modifiedCount ) ; 
					console.log("Added in sent request array");

					collection.find({'emailid' : to_be_friend.emailid}).toArray(function(err,result){

						if(err){

							console.log("In friend.js : addFrndForNewUser : Error while finding the user record in db " ) ;
							throw err;
						}else{

							if(result.length == 0 ){
								//insert new record
								console.log("In friend.js : addFrndForNewUser : User not present in db!!")
								collection.insert({
        							"emailid" : to_be_friend.emailid,
			        				"password": "",
			        				"screenname": "",
			        				"verified" : false,
			        				"otp" : "",
			        				"location": "",
			        				"profession": "",
			        				"about_me": "",
			        				"interests": [],
			        				"visibility": "public",
			        				"notification": false,
			        				"profile_pic" : "",
			        				"frnds": [],
			        				"pending_req": [requester.emailid],
			        				"sent_req": [],
			        				"following" :[],
			        				"acct_exits" : false,
			        				"posts" : 
			        					[{
			        						"content": "", 
			        						"media_url": "",
			        						"timestamp": "",
			        					}]
        						},function(err,result){

        							if(err){

        								console.log("In friend.js : addFrndForNewUser :  Error while inserting new record ");
        								throw err;
        							}else{

        								//Send email to the new user for installing app

        								var text = "Install the app";
										var to_email = to_be_friend.emailid ;
										var data = {"content": text, "to_email": to_email, "subject": "Invitation to join the Chat App"};
										
										utils.mail(data, function(error, info){
											if(!error){
												console.log('Message sent: ' + info.response);
										        res.json({'status': '200', 'msg': 'success'});
											}
											else{
												console.log(error);
										        res.json({'status': '400', 'mgs':error});
											}
										});
        							}
        						});

							}else{

								//Update the record
								collection.updateOne( {'emailid' : to_be_friend.emailid } , { $addToSet : {"pending_req" :  requester.emailid  } }, function(err , results){

									if(err){
										console.log("In friend.js : addFrndForNewUser :  Error while adding friend Id in pending_req array ")
										throw err;
									}else{

										console.log("In friend.js : addFrndForNewUser : Added in pending request array");
										res.json({'status': '200', 'msg': 'friend request added successfully'});
									}
								});

							}
						}

					});

				}

			}) ;
		}
	});
	
}


exports.fetchPendingRequests= function(req, res){

	var emailid  = req.body.emailid ;

	console.log("In friend.js : fetchPendingRequests : Fetching Pending Request") ;

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : fetchPendingRequests : Error while fetching collection object!") ;
			throw err;
		}else{

			collection.findOne({"emailid" : emailid}, {"_id" : 0 , "pending_req" : 1}, function (err, result){

				if(err){

					console.log("In friend.js : fetchPendingRequests : Error while fetching pending request array!") ;
					throw err;
				}else{

					var emailid_req_array = result.pending_req ; 
					console.log("Result after finding pending request array : " + JSON.stringify(emailid_req_array)) ;
					console.log("Pending Email IDs : " + JSON.stringify( emailid_req_array )) ;
					collection.find( {"emailid" : {$in : emailid_req_array}} , {"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 }).toArray( function(err , result){

						if(err){

							console.log("In friend.js : fetchPendingRequests : Error while fetching screename and profile pic for pending request array!") ;
							throw err;
						}else{
							console.log( "Required Data : " + JSON.stringify(result ));
							res.json ( {'status' : '200' , 'data' : result}) ;

						}
					} );
				}
			});
		}
	});



}

