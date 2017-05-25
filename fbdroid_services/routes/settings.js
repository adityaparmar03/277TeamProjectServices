
exports.getsettings = function(req, res){
	var emailid = req.params.emailid;
	console.log(emailid);
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);		
		}
		else{
			
			collection.findOne({"emailid": emailid}, function(err, docs){
				if(!err){
					console.log(docs);
					res.json({'status':'200', 'msg':{'visibility': docs.visibility, 'notification': docs.notification}});
				}
				else{
					res.json({'status': '400', 'msg':'Could not fetch settings'});
				}
				
			});
		}
	});
}


exports.setsettings = function(req, res){
	
	var emailid = req.body.emailid;
	var visibility = req.body.friendsonly;
	var notification = req.body.notification;
	
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);
			
		}
		else{
			
			collection.findAndModify({"emailid": emailid}, [], 
			{$set: {"visibility":visibility, "notification": notification }}, {new: false}, 
			function(err, info){
				if(err){
					console.warn(err);
					res.json({'status': '400', 'msg': err});
				}
				else{
					console.log("Updated settings");
					res.json({'status': '200', 'msg': 'Settings applied'});
				}
			});
		}
	});
	
	
}