
//updates the user profile
exports.profile_update = function(req, res){
	var screenname = req.body.screenName;
	var emailid = req.body.emailid;
	var location1 = req.body.location;
	var profession = req.body.profession;
	var about_me = req.body.aboutme;
	var interests = req.body.interests;
	var profile_pic = req.body.profilepicUrl;
	
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);
			throw err ;
		}
		else{

			collection.findOne( {"screenname" : screenname},function(err , result){

				if(err) {

					console.log("In profile.js : profile_update  : Error while fetching the user details to check for duplicate record based on the screenname") ;
					throw err;

				}else{

					if(result) {

						console.log("In profile.js : profile_update : Duplicate screenname. So returning negative response!!!") ;
						res.json({'status':'300', 'msg': 'Duplicate screenname'});

					}else{

						console.log("In profile.js : profile_update : screenname is unique ") ;
						collection.findAndModify( {"emailid": emailid}, [], 
						{$set: {"location": location, "profession": profession, "about_me": about_me, 
						"interests": interests, "screenname": screenname}}, {new: false}, function(err, result){
							if(err)
							{
								console.log(err);
								res.json({'status':'400', 'msg': err});
							}
							else
							{
								console.log("Updated the user profile");
								res.json({'status':'200', 'msg': 'updated'});
							}
						});
					}
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
