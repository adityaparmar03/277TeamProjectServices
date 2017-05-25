var dateTime = require('node-datetime');

exports.posts = function(req, res){
	var emailid = req.body.emailid;
	var content = req.body.content;
	var media_url = req.body.image;
	
	
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	console.log(formatted);
	
	var post = {
			'content': content,
			'media_url': media_url,
			'timestamp': formatted,
	}
	
	global.db.collection('fbdroid', function (err, collection) {
		if(!err){
			collection.updateOne( {'emailid' : requester.emailid } , 
					{ $push : { 'posts' :  to_be_friend.emailid  } }, 
					function(err , results){
						
					});
		}
		
	});
}