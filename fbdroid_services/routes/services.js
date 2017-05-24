var nodemailer = require('nodemailer');
var mongodb = require('mongodb');
var db;
var connected = false;


var MongoClient = mongodb.MongoClient;
MongoClient.connect("mongodb://root:rootcmpe277db@ds133311.mlab.com:33311/cmpe277db", function(err, database) {
	if(!err) {
		console.log("We are connected");
    	db = database;
	}
});


//email service 
exports.email = function(req, res){
	
	var emailid = req.body.emailid;
	var password = req.body.password;
	db.collection('fbdroid', function (err, collection) {
        
        collection.insert({ emailid: emailid , password: password, verified: true });
        console.log("Inserted emailid and password");

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
	
	//connecting to MongoDB using MongoClient
	var MongoClient = mongodb.MongoClient;
	    
	    db.collection('fbdroid', function (err, collection) {
	        
	        collection.update({ emaild: emailid}, {$set:{otp: rand_number }});
	        console.log("Inserted otp");

	});
			
	//Defining mail configuration, to from and body
	var mailOptions = {
		    
			from: 'fbdroidservices@gmail.com', // sender address
		    to: 'deepikakalani@gmail.com', // list of receivers
		    subject: 'Email Example', // Subject line
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

/*
 export.verify_otp = function(req, res){
 	var received_otp = req.otp;
 }
 */

exports.signin = function(req, res){
	var emailid = req.body.emailid;
	var password = req.body.password;
	db.collection('fbdroid', function (err, collection) {
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
