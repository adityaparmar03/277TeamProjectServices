var mongo = require("./mongo");



exports.addFrnd = function(req, res){
	var emailid = req.body.emailid;
	var frnd_emailid = req.body.frnd_emailid;
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + JSON.stringify(err));
		}
		else{
			collection.find({emailid:emailid}).toArray(function(err, docs){
				if(!err){
					console.log(docs);
					if(docs[0].password == password && docs[0].verified == true){
						res.json({'status': '200', 'msg': 'success'});
					}
					else if(docs[0].password == password && docs[0].verified == false){
						res.json({'status': '300', 'msg': 'verification required'});
					}
					else{
						res.json({'status': '400', 'msg': 'incorrect password'})
					}
				}
			})
			
		}
	});
	
}
