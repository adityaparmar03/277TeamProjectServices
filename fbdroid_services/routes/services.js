var nodemailer = require('nodemailer');
var mongo = require("./mongo");
var connected = false; 
var utils = require("./utils")

//email service 
exports.signup = function(req, res){
	
	var emailid = req.body.emailid;
	var password = req.body.password;
	console.log(emailid);
	console.log(password);
	
	global.db.collection('fbdroid', function (err, collection) {
        	
		if(err){
			console.log("No such collection found " + err);
			return;
		}
		
        collection.find({"emailid": emailid}).toArray(function(err, docs){
        	if(err){
        		console.log(err);
        	}
        	else{
        		if(docs.length == 0){
        			collection.insert({
        				"emailid" : emailid,
        				"password": password,
        				"screenname": "",
        				"verified" : false,
        				"otp" : "",
        				"location": "",
        				"profession": "",
        				"about_me": "",
        				"interests": [],
        				"visibility": false,
        				"notification": false,
        				"profile_pic" : "",
        				"frnds": [],
        				"pending_req": [],
        				"sent_req": [],
        				"following" :[],
        				"posts" : 
        					[{
        						"content": "", 
        						"media_url": "",
        						"timestamp": "",
        					}]
        			}, function(err, response){
        				if(!err){
        					console.log("Inserted a document");
                			res.json({'status': '200', 'msg': 'Inserted new user'})
        				}
        				
        				else{
        					console.log(err);
        					res.json({'status': '400', 'msg': 'Creation of user failed'})
        				}
        			});
        			
        		}
        		else{
        			console.log(docs[0]);
        			res.json({'status': '300', 'msg': 'User already exists'});
        		}
        	
        	}
        });

	});
		
	//function for generating random number
	var randomFixedInteger = function (length) {
		return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
	}
	
	var rand_number = randomFixedInteger(4);
	console.log(rand_number);
	
	var text = "Verification code for FBDroid is " + rand_number;
	var to_email = emailid
	var data = {"content": text, "to_email": to_email, "subject": "FBDroid verification"};
	
	utils.mail(data, function(error, info){
		if(!error){
			console.log('Message sent: ' + info.response);
	        res.json({'status': '200', 'msg': 'success'});
		}
		else{
			console.log(error);
	        res.json({'status': '400', 'mgs':error});
		}
	});
	
}


exports.verify_otp = function(req, res){
	var received_otp = req.body.otp;
 	var emailid = req.body.emailid;
 	
 	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);
		}
		else{
			collection.find({"emailid": emailid}).toArray(function(err, docs){
				if(err){
	        		console.log("No such user found "+ err);
	        	}
				else{
						if(received_otp == docs[0].otp){
							res.json({'status': '200', 'msg': 'verified'});
							console.log("User verified with OTP");
						}
						else{
							res.json({'status': '400', 'msg': 'verification required'});
							console.log("User could not be verified. wrong OTP entered.")
						}
				}
			});
		}
	});
 	
}
 

exports.signin = function(req, res){
	var emailid = req.body.emailid;
	var password = req.body.password;
	global.db.collection('fbdroid', function (err, collection) {
		if(err){
			console.log("No such collection exists" + err);
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


