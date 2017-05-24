var nodemailer = require('nodemailer');
var mongo = require("./mongo");
var connected = false; 

//email service 
exports.email = function(req, res){
	
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
        				"visibility": "public",
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
        			});
        			//collection.insert({ emailid: emailid , password: password, verified: false });
        			console.log("Inserted a document");
        			res.json({'status': '200', 'msg': 'Inserted new user'})
        		}
        		else{
        			console.log(docs[0]);
        			res.json({'status': '300', 'msg': 'User already exists'});
        		}
        	
        	}
        });

	});
	var transporter = nodemailer.createTransport({
		
		service: 'Gmail',
        auth: {
            user: 'fbdroidservices@gmail.com', // Your email id
            pass: 'fbcmpe277' // Your password
        }
	});
		
	//function for generating random number
	var randomFixedInteger = function (length) {
		return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
	}
	
	var rand_number = randomFixedInteger(4);
	console.log(rand_number);
	
	var text = "Verification code for FBDroid is " + rand_number;
	var to_email = emailid
	
	//connecting to MongoDB using MongoClient
	global.db.collection('fbdroid', function (err, collection) {
	        
	    collection.update({ "emailid": emailid}, {$set:{otp: rand_number }});
	    console.log("Inserted otp");

	});
			
	//Defining mail configuration, to from and body
	var mailOptions = {
		    
			from: 'fbdroidservices@gmail.com', // sender address
		    to: to_email, // list of receivers
		    subject: 'FBdroid verification', // Subject line
		    text: text //, // plaintext body
		    
	};
	
	//Sending Email
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        res.json({'status': '400', 'mgs':error});
	    }else{
	        console.log('Message sent: ' + info.response);
	        res.json({'status': '200', 'msg': 'success'});
	    };
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