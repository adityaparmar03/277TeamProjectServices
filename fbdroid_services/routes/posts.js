
exports.addpost = function(req, res){
	var emailid = req.body.emailid;
	var content = req.body.content;
	var media_url = req.body.media_url;
	var screenname = req.body.screenname ;
	var profile_pic = req.body.profile_pic ;
	
	var date = new Date();	
	
	var post = {
			'content': content,
			'media_url': media_url,
			'timestamp': date,
	}
	
	global.db.collection('fbdroid', function (err, collection) {
		if(!err){
			collection.updateOne( {'emailid' : emailid } , 
			{ $push : { 'posts' :  post  } }, 
			function(err , results){
				if(!err){
					console.log(results.modifiedCount);
					if(results.modifiedCount == 1){
						//Send the notifications to all the followers about the post
						var data = {

							'content' : 'New Post from '+ screenname ,
							'time' : date ,
							'profile_pic' : profile_pic, 
							'screenname' : screenname  
						}
						sendNotificationsToFollowers ( emailid , data, res ) ;

						//res.json({'status': '200', 'msg': 'Post added successfully'})
					}
					else{
						res.json({'status': '400', 'msg': 'Error adding post'})
					}
				}
				else{
					res.json({'status': '400', 'msg': err})
				}
			});
		}
		
	});
}


exports.getpost = function(req, res){
	var emailid = req.params.emailid;
	var posts = [];
	global.db.collection('fbdroid', function (err, collection){
		if(!err){
			collection.findOne({"emailid": emailid}, {_id: 0, "following":1}, function(err, results){
				if(err){
					//console.log('status':'400', 'msg': 'error '+ err);
					console.log(err);
					res.json({'status':'400', 'msg': 'error '+ err});
				}
				else{
					console.log(results.following);
					results.following.push(emailid);
					
					collection.aggregate({$match: {"emailid": {$in: results.following}}},{$unwind: "$posts"},{$project:{ "_id":0 ,"screenname" :1 ,"profile_pic" : 1, "content": "$posts.content", "media_url": "$posts.media_url","timestamp":"$posts.timestamp"}},{$sort: {"timestamp": -1}}, function(err, result){
						if(!err){
							console.log("Result:" + JSON.stringify(result));
							res.json(result);
						}
						else{
							console.log(err);
							res.json({'status': '400', 'msg': err});
						}
					})
					
					
				}
			})
		}
	});
}



function sendNotificationsToFollowers( emailid , data , res  ) {

	console.log("In posts.js : sendNotificationsToFollowers : Updating the notifications for all the followers!!!") ;

	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);		
		}
		else{

			//var bulk = collection.initializeUnorderedBulkOp(); 
			collection.findOne({"emailid" : emailid },{"_id": 0 , "following" : 1 } , function (err,result){
				console.log("In posts.js : sendNotificationsToFollowers : Result after fetching the followers: + ", result)
				if(err){

					console.log("In posts.js : sendNotificationsToFollowers : Error while fetching the followers!!!");
					throw err; 
				}else{

					console.log("In posts.js : sendNotificationsToFollowers : Result of the followers  ") ;
					var followersList =  result.following ;

					console.log("In posts.js : sendNotificationsToFollowers : Result after getting the array of followers: + ", followersList) ;
					if(followersList.length > 0){

						var bulk = collection.initializeUnorderedBulkOp();
						bulk.find({'emailid' : {$in : followersList }})
							.update({$addToSet : {"notifications" : data }}) ;
						bulk.execute([],function(err, result ){

							if(err){

								console.log("Error while sending the notifications to the followers!!!") ;
							}else{

								console.log("Sent the notifications to the followers!!!") ;
							}
							
							res.json({'status' : '200' ,'msg' : 'Posts added successfully!!!!'})
						}) ;
						

					}else{

						console.log("In posts.js : sendNotificationsToFollowers : No result returned for the followers!!!!") ;
						res.json({'status' : '400' , 'msg' : 'Error while fetching the followers!!!'}) ;
					}
				}

			} );
		}
	});
}