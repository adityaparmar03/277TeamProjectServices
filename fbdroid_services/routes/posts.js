
exports.addpost = function(req, res){
	var emailid = req.body.emailid;
	var content = req.body.content;
	var media_url = req.body.media_url;
	
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
						res.json({'status': '200', 'msg': 'Post added successfully'})
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
					
					collection.aggregate({$match: {"emailid": {$in: results.following}}},{$project: {_id: 0, "screenname": 1, "posts": 1}},{$unwind: "$posts"}, {$sort: {"posts.timestamp": -1}}, function(err, result){
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