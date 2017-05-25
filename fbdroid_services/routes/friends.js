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
			throw err;
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
			throw err;
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
										        res.json({'status': '400', 'mgs': 'Error'});
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

	var emailid  = req.params.emailid ;

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
					if(result){
						var emailid_req_array = result.pending_req ; 
						console.log("Result after finding pending request array : " + JSON.stringify(emailid_req_array)) ;
						console.log("Pending Email IDs : " + JSON.stringify( emailid_req_array )) ;
						collection.find( {"emailid" : {$in : emailid_req_array}} , {"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 }).toArray( function(err , result){

							if(err){

								console.log("In friend.js : fetchPendingRequests : Error while fetching screename and profile pic for pending request array!") ;
								throw err;
							}else{
								console.log( "Required Data : " + JSON.stringify(result ));
								res.json ( result) ;

							}
						} );
					}
				}
			});
		}
	});
}


exports.fetchSentRequests= function(req, res){

	var emailid  = req.params.emailid ;

	console.log("In friend.js : fetchSentRequests : Fetching Sent Request") ;

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : fetchSentRequests : Error while fetching collection object!") ;
			throw err;
		}else{

			collection.findOne({"emailid" : emailid}, {"_id" : 0 , "sent_req" : 1}, function (err, result){

				if(err){

					console.log("In friend.js : fetchSentRequests : Error while fetching sent request array!") ;
					throw err;
				}else{
					if(result){
						var emailid_req_array = result.sent_req ; 
						console.log("Result after finding pending request array : " + JSON.stringify(emailid_req_array)) ;
						console.log("Pending Email IDs : " + JSON.stringify( emailid_req_array )) ;
						collection.find( {"emailid" : {$in : emailid_req_array}} , {"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 }).toArray( function(err , result){

							if(err){

								console.log("In friend.js : fetchSentRequests : Error while fetching screename and profile pic for pending request array!") ;
								throw err;
							}else{
								console.log( "Required Data : " + JSON.stringify(result ));
								res.json ( result ) ;

							}
						} );
					}
				}
			});
		}
	});
}


exports.confirmPendingFrndRequest = function (req, res){

	var sender_emailid = req.body.sender_emailid ; 
	var requestor_emailid = req.body.requestor_emailid ; 

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : confirmPendingFrndRequest : Error while getting the collection!!") ;
			throw err;
		}else{

			collection.updateOne( {'emailid' : sender_emailid } , { $addToSet : {"frnds" :  requestor_emailid , "following" : requestor_emailid } , $pull : {"pending_req" : requestor_emailid } }, function(err , results){

				if(err){

					console.log("In friend.js : confirmPendingFrndRequest : Error while updating the sender's record for the confirm request made!!") ;
					throw err;
				}else {

					if(results.modifiedCount == 1) {

						console.log("In friend.js : confirmPendingFrndRequest : Sender's changes made...Added new friend in his list!!") ;

						//Updating the friend request sender's friend list

						collection.updateOne( {'emailid' : requestor_emailid } , { $addToSet : {"frnds" :  sender_emailid ,"following" :  sender_emailid} , $pull : {"sent_req" : sender_emailid } }, function(err , results){
						
							if(err){

								console.log("In friend.js : confirmPendingFrndRequest : Error while updating the requestor's record for the confirm request made!!") ;
								throw err;
							}else{

								if(results.modifiedCount == 1) {

									console.log("In friend.js : confirmPendingFrndRequest : Updated the friend lists for both the user and the requestor!!") ;
									res.json({'status' : '200' , 'msg' : 'Friend request confirmed successfully'}) ;

								}else{

									console.log("In friend.js : confirmPendingFrndRequest : Couldn't update the friend lists for both the user and the requestor!!") ;
									res.json({'status' : '400' , 'msg' : 'Friend request not confirmed successfully'}) ;
								}

							}
						}); 

					}else{

						console.log("In friend.js : confirmPendingFrndRequest : Updated the friend lists for both the user and the requestor!!") ;
						res.json({'status' : '400' , 'msg' : 'Friend request not confirmed successfully'}) ;
					}
				}

			});
		}
	});
}


exports.rejectPendingFrndRequest = function (req, res){

	var sender_emailid = req.body.sender_emailid ; 
	var requestor_emailid = req.body.requestor_emailid ; 

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : rejectPendingFrndRequest : Error while getting the collection!!") ;
			throw err;
		}else{

			collection.updateOne( {'emailid' : sender_emailid } , { $pull : {"pending_req" : requestor_emailid } }, function(err , results){

				if(err){

					console.log("In friend.js : rejectPendingFrndRequest : Error while updating the sender's record for the confirm request made!!") ;
					throw err;
				}else {

					if(results.modifiedCount == 1) {

						console.log("In friend.js : rejectPendingFrndRequest : Sender's changes made...Rejected the friend request!!") ;

						//Updating the friend request sender's friend list

						collection.updateOne( {'emailid' : requestor_emailid } , { $pull : {"sent_req" : sender_emailid } }, function(err , results){
						
							if(err){

								console.log("In friend.js : rejectPendingFrndRequest : Error while updating the requestor's record for the reject request made!!") ;
								throw err;
							}else{

								if(results.modifiedCount == 1) {

									console.log("In friend.js : rejectPendingFrndRequest : Updated the lists for both parties for rejecting the request!!") ;
									res.json({'status' : '200' , 'msg' : 'Friend request rejected successfully'}) ;

								}else{

									console.log("In friend.js : rejectPendingFrndRequest : Couldn't update the friend lists for both the user and the requestor!!") ;
									res.json({'status' : '400' , 'msg' : 'Friend request not rejected successfully'}) ;
								}

							}
						}); 

					}else{

						console.log("In friend.js : rejectPendingFrndRequest : Updated the friend lists for both the user and the requestor!!") ;
						res.json({'status' : '400' , 'msg' : 'Friend request not rejected successfully'}) ;
					}
				}

			});
		}
	});
}



exports.fetchFriendsDtls = function (req, res){

	var emailid = req.params.emailid ; 

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : fetchFriendsDtls : Error while getting the collection!!") ;
			throw err;
		}else{

			collection.findOne({"emailid" : emailid}, {"_id" : 0 , "frnds" : 1}, function (err, result){

				if(err){

					console.log("In friend.js : fetchFriendsDtls : Error while fetching the friend list") ;
					throw err;
				}else{

					var emailid_frnds_array = result.frnds ; 
					collection.find( {"emailid" : {$in : emailid_frnds_array}} , {"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 }).toArray( function(err , result){


						if(err){

							console.log("In friend.js : fetchFriendsDtls : Error while fetching screename and profile pic for friends array!") ;
							throw err;
						}else{
							console.log( "In friend.js : fetchFriendsDtls : Required Data : " + JSON.stringify(result ));
							res.json ( result ) ;

						}
					});
				}
			});
		}

	});
}

//Method to follow a particular user
exports.followUser = function(req, res) {

	var current_user = req.body.current_user ; 
	var followed_emailid = req.body.followed_emailid ; 

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err){

			console.log("In friend.js : followUser : Error while getting the collection!!") ;
			throw err;
		}else{


			collection.updateOne( {'emailid' : current_user } , { $addToSet : { "following" :  followed_emailid }}, function(err , results){

				if(err){

					console.log("In friend.js : followUser : Error adding the user to the following list!!") ;
					throw err ;
				}else{

					res.json({'status' : '200' ,'msg' : 'Following the user successfully'}) ;
				}
			});
		}
	});
}	


