
//updates the user profile
exports.profile_update = function(req, res){
	var emailid = req.body.emailid;
	var location = req.body.location;
	var profession = req.body.profession;
	var about_me = req.body.about_me;
	var interests = req.body.interests;
	
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);
		}
		else{
			collection.findAndModify({"emailid": emailid}, [], 
			{$set: {"location": location, "profession": profession, "about_me": about_me, 
			"interests": interests}}, {new: false}, function(err, res){
				if(err){
					console.warn(err);
				}
				else{
					console.log("Updated the user profile")
				}
			});
		}
		
	});
}