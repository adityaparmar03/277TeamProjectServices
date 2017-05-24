var nodemailer = require('nodemailer');

exports.mail = function(data , callback){
	
	var content = data.content
	var to_email = data.to_email
	var subject = data.subject
	
	var transporter = nodemailer.createTransport({
		
		service: 'Gmail',
        auth: {
            user: 'fbdroidservices@gmail.com', // Your email id
            pass: 'fbcmpe277' // Your password
        }
	});
	
	//Defining mail configuration, to from and body
	var mailOptions = {
		    
			from: 'fbdroidservices@gmail.com', // sender address
		    to: to_email, // list of receivers
		    subject: subject, // Subject line
		    text: content //, // plaintext body
		    
	};
	
	//Sending Email
	transporter.sendMail(mailOptions, function(error, info){
	    callback(error, info);
	});
		
} 