
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


exports.getUserProfile = function (req, res) {

	var emailid = req.params.emailid ;

	console.log("In user.js : getUserProfile : Fetching the user details for email ID : " + emailid ) ;

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err) {

			console.log("In user.js : getUserProfile : Error while fetching the collection") ;
			throw err;
		}else{
			collection.findOne({"emailid" : emailid },{"_id" : 0 , "emailid" : 1 , "screenname" : 1 , "about_me" : 1 ,"location" : 1 ,"profession" : 1, "interests" : 1, "posts" : 1, "online" : 1, "profile_pic" : 1}, function(err, result){

				if(err) {

					console.log("In user.js : getUserProfile : Error while fetching the user profile!!" ) ;
					throw err;
				}else{

					if(result) {
						console.log("In user.js : getUserProfile : Successfully fetched user profile!!!")
						res.json(result) ;
					}else{

						console.log("In user.js : getUserProfile : Failed to fetch the user profile!!!")
						res.json({}) ;
					}
				}
			});
		}
	});
}

exports.getBasicUserProfile = function (req, res) {

	var emailid = req.params.emailid ;

	console.log("In user.js : getBasicUserProfile : Fetching the user details for email ID : " + emailid ) ;

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err) {

			console.log("In user.js : getBasicUserProfile : Error while fetching the collection") ;
			throw err;
		}else{
			collection.findOne({"emailid" : emailid },{"_id" : 0 , "emailid" : 1 , "screenname" : 1 ,  "profile_pic" : 1}, function(err, result){

				if(err) {

					console.log("In user.js : getBasicUserProfile : Error while fetching the user profile!!" ) ;
					throw err;
				}else{

					if(result) {
						console.log("In user.js : getBasicUserProfile : Successfully fetched user profile!!!")
						res.json(result) ;
					}else{

						console.log("In user.js : getBasicUserProfile : Failed to fetch the user profile!!!")
						res.json({}) ;
					}
				}
			});
		}
	});
}