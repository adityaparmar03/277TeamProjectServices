var nodemailer = require('nodemailer');
var mongodb = require('mongodb');

//email service 
exports.email = function(req, res){
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
	MongoClient.connect("mongodb://root:rootcmpe277db@ds133311.mlab.com:33311/cmpe277db", function(err, db) {
		if(!err) {
	    console.log("We are connected");
	    
	    db.collection('fbdroid', function (err, collection) {
	        
	        collection.insert({ id: 1, otp: rand_number });
	        console.log("Inserted otp");
	    
	    });
	  }
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
	        res.json({yo: 'error'});
	    }else{
	        console.log('Message sent: ' + info.response);
	        res.json({yo: info.response});
	    };
	});
}