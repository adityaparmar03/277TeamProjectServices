
/*
 * GET users listing.
 */

 var mongo = require("./mongo");

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.searchUsers = function(req, res) {

	var search_text = req.body.search_text ;
	console.log( "In user.js : Search Text : " + search_text ) ;
	console.log("In user.js : searchUsers : Search the users list for the given text search") ;

	global.db.collection( 'fbdroid', function (err, collection) {
		
		if(err){
			console.log("In user.js : searchUsers : Error while finding the collection!!");
			throw err;
		}else{

			collection.find( {"screenname" : { $regex : search_text , $options : 'i'}} ,{"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 }).toArray(  
				//{"_id" : 0 ,"emailid" :  1 , "screenname" : 1 , "profile_pic" : 1 } ,
			 function(err, result){

				if(err){

					console.log("In user.js : searchUsers : Error while fetching the users based on the search criteria!!");
					throw err;
				}else{
					if(result){
						console.log("In user.js : searchUsers : Got results ") ;
						res.json(result) ;
					}else{
						console.log("In user.js : searchUsers : Did not get results ") ;
						res.json([]) ;
					}
				}
			});

		}
	});
}


exports.displayPostsOfUser = function ( req, res ) {

	var emailid = req.params.emailid ; 

	global.db.collection( 'fbdroid', function (err, collection) {

		if(err) {

			console.log("In user.js : displayPostsOfUser : Error while fetching the collection") ;
			throw err;
		}else{

			collection.aggregate({$match : { "emailid" : emailid}} ,{$project :{"_id" : 0 ,"posts" : 1}},{$unwind : "$posts"}, { $sort: { 'posts.timestamp': -1 }}, function(err,result){

				if(err) {

					console.log("In user.js : displayPostsOfUser : Error while fetching the posts!!");
					throw err;
				}else{
					if(result){
						console.log("In user.js : displayPostsOfUser : Fetched the posts suceessfully!!");
						res.json(result) ;
					}else{
						console.log("In user.js : displayPostsOfUser : Couldn't fetch the posts !!");
						res.json([]]) ;
					}

				}
			});
		}
	});

}
