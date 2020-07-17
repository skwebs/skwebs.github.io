"use strict";
$(document).ready(function() {

	//declare variables
	var formData;
	var spin = '<span class="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>';;
	
	// process the form
	$('#contact-form').submit(function(event) {
	//	$(".process-msg").fadeOut();
		
		$('.form-group .form-control').removeClass('border-danger'); // remove the error class
		$('.text-danger').remove(); // remove the error text

		// get the form data
		// there are many ways to get this data using jQuery (you can use the class or id also)
		 formData = {
			'name' 	: $('input[name=name]').val(),
			'mob' 	: $('input[name=mob]').val(),
			'email'	: $('input[name=email]').val(),
			'sub' 	: $('input[name=sub]').val(),
			'msg' 	: $('textarea[name=msg]').val()
		};

		// server side form validation
		$.ajax({
			type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
			url 		: './assets/php/footer-contact/validate.php', // the url where we want to POST
			data 		: formData, // our data object
			dataType 	: 'json', // what type of data do we expect back from the server
			encode 		: true,
			beforeSend	: ()=>{
				process({show:true,msg:"Data validating..."});
			}/*,
			error		: (err)=>{alert("error : \n\n"+JSON.stringify(err))},
			success		: (suc)=>{alert("success : \n\n"+JSON.stringify(suc))},
			complete	: (comp)=>{alert("complete : \n\n"+JSON.stringify(comp))}*/
		})
		//(1)
		.done(function(data) {
			if ( data.success){
				process({show:true,msg:"Data validated!"});
				
				// send mail after validation
				$.ajax({
					type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
					url 		: './assets/php/footer-contact/send-mail-otp.php', // the url where we want to POST
					data 		: formData, // our data object
					dataType 	: 'json', // what type of data do we expect back from the server
					encode 		: true,
					beforeSend	: ()=>{
						process({show:true,msg:"OTP Mail sending..."});
					}
				})
				//(2)
				.done(function(data) {
					process({show:false});
					alert(data.mail_otp.message)
					
					if (data.mail_otp.success) {
					//mail otp email sent successfully.
					$("#verifyOTPModal").modal("show");
					//	process({show:false});
					//	alert(data.mail_otp.message)
					otpTimeFroServer(data.mail_otp.time);
					startCD();
					}else{
					//mail otp email failure.
					//	process({show:false});
						alert(data.mail_otp.message)
					}
				}).fail(function(data) {
					alert("fail :\n\n"+JSON.stringify(data));
					process({show:false});
					// best to remove for production
					console.log(data);
				})
				;
				
			// here we will handle errors and validation messages
			}else {
				process({show:false});
				//$(".process-msg").html("").parent().css("display","none");
				
				// handle errors for name ---------------
				if (data.errors.name) {
					$('#name-group input').addClass('border-danger'); // add the error class to show red input
					$('#name-group').append('<div class="text-danger">' + data.errors.name + '</div>'); // add the actual error message under our input
				}

				// handle errors for mob ---------------
				if (data.errors.mob) {
					$('#mob-group input').addClass('border-danger'); // add the error class to show red input
					$('#mob-group').append('<div class="text-danger">' + data.errors.mob + '</div>'); // add the actual error message under our input
				}

				// handle errors for email ---------------
				if (data.errors.email) {
					$('#email-group input').addClass('border-danger'); // add the error class to show red input
					$('#email-group').append('<div class="text-danger">' + data.errors.email + '</div>'); // add the actual error message under our input
				}

				// handle errors for sub ---------------
				if (data.errors.sub) {
					$('#sub-group input').addClass('border-danger'); // add the error class to show red input
					$('#sub-group').append('<div class="text-danger">' + data.errors.sub + '</div>'); // add the actual error message under our input
				}
				// handle errors for msg ---------------
				if (data.errors.msg) {
					$('#msg-group textarea').addClass('border-danger'); // add the error class to show red input
					$('#msg-group').append('<div class="text-danger">' + data.errors.msg + '</div>'); // add the actual error message under our input
				}

			} /*else {

				// ALL GOOD! just show the success message!
				$('form').append('<div class="alert alert-success">' + data.message + '</div>');

				// usually after form submission, you'll want to redirect
				// window.location = '/thank-you'; // redirect a user to another page

			}*/
		})

			// using the fail promise callback
			.fail(function(data) {
				alert("fail :\n\n"+JSON.stringify(data));
				process({show:false});
				//$(".process-msg").html("").parent().css("display","none");
				// show any errors
				// best to remove for production
				console.log(data);
			});

		// stop the form from submitting the normal way and refreshing the page
		event.preventDefault();
	});

$(document).on("focus","#mob-group",()=>{
	alert("Please enter active Mobile Number because we send OTP to verify your Mobile Number.")
})
var process=(data)=>{
	if(data.show){
		$(".process-msg").html(data.msg).parent().css("display","flex");
	}else{
		$(".process-msg").html("").parent().css("display","none");
	}
}

// resend otp
$(document).on("click","#resend-otp",()=>{
	$.ajax({
		type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
		url 		: './assets/php/footer-contact/send-mail-otp.php', // the url where we want to POST
		data 		: formData, // our data object
		dataType 	: 'json', // what type of data do we expect back from the server
		encode 		: true,
		beforeSend	: ()=>{
			process({show:true,msg:"OTP Mail Resending..."});
		}
	})
	//(2)
	.done(function(data) {
		process({show:false});
		alert(data.mail_otp.message)
		$("#otpForm")[0].reset();
		$("#otpExpMsg").attr("class", "text-muted").html('Resend OTP');
		
		if (data.mail_otp.success) {
			//mail otp email resent.
			$("#resend-otp").attr("disabled", true).html(spin+' Resend OTP');
			$("#verify-otp").attr("disabled", false).html('Verify OTP');
			//	process({show:false});
			//	alert(data.mail_otp.message)
			otpTimeFroServer(data.mail_otp.time);
			startCD();
		}else{
		//mail otp email failure.
		//	process({show:false});
			alert(data.mail_otp.message)
		}
	})
});

// verify otp
$(document).on("click","#verify-otp",()=>{
	var otp = $("#otp").val();
	if(otp==""){
		alert("Please enter verification code!")
	}else if(otp.length!=6){
		alert("OTP must be 6 digits.");
	}else{
		$.ajax({
			type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
			url 		: './assets/php/footer-contact/verify-otp.php', // the url where we want to POST
			data 		: {otp:otp}, // our data object
			dataType 	: 'json', // what type of data do we expect back from the server
			encode 		: true,
			beforeSend	: ()=>{
				process({show:true,msg:"OTP Verifying..."});
			}
		})
		//(1)
		.done(function(data) {
		//	alert(JSON.stringify(data));
			process({show:false});
			if(data.otp.error){
				alert(data.otp.msg)
			}else{
			// if otp verified
				$("#otpForm")[0].reset();
				$("#verifyOTPModal").modal("hide");
				// send confirmation email by ajax
				$.ajax({
					type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
					url 		: './assets/php/footer-contact/confirm-mail.php', // the url where we want to POST
					data 		: formData, // our data object
					dataType 	: 'json', // what type of data do we expect back from the server
					encode 		: true,
					beforeSend	: ()=>{
						process({show:true,msg:"OTP verified.<br>Sending confirmation mail..."});
					}
				})
				// confirmation email process promise
				.done(function(data) {
					if (data.user.success) {
					// if user email sent
						//$(".process-msg").append("<p>User mail sent !</p>").parent().css("display","flex");
						process({show:true,msg:"User mail sent!"});
						if (data.admin.success) {
						// if admin email sent
							//process({show:false});
							alert("Contact form submitted!")
							$("#contact-form")[0].reset();
						}else{
						// if admin email failure
							//process({show:false});
							//$(".process-msg").html("").parent().css("display","none");
							alert(data.admin.message)
						}
					}else{
					// if user email failure
						//process({show:false});
						//$(".process-msg").html("").parent().css("display","none");
						alert(data.user.message)
					}
					
					process({show:false}); 
					//alert("OTP Verified.");
				});
			}
		});
	}
})











// otp 
  var otpExpMsg = document.querySelector("#otpExpMsg");
  var Interval, otpTime,
  otpExpTime=90;
function otpTimeFroServer(t){
	otpTime = t;
}
  function startCD() {
     clearInterval(Interval);
     Interval = setInterval(startTimer, 100);
  }
  
    function stopCD() {
       clearInterval(Interval);
  }
  

  function startTimer () {
    var expSec = otpTime + otpExpTime - Math.floor(new Date().getTime()/1000);
    if(expSec > 0){
	    // code here
	    otpExpMsg.innerHTML="Your otp will expire in "+expSec+"s.";
	    //otpExpMsg.style.color="gray";
	}else{
	    $("#otpExpMsg").attr("class", "text-danger").html('Resend OTP');
	    $("#resend-otp").attr("disabled", false).html('Resend OTP');
	    $("#verify-otp").attr("disabled", true).html(spin+' Verify OTP');
	    otpExpMsg.innerHTML="Timeout! Request for \"Resend OTP\".";
	    otpExpMsg.style.color="#f00 !important";
	    stopCD();
    }
  }


});