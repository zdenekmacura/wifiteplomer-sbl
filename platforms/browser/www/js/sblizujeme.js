
$(document).ready(function(){

	    var url="http://www.brrr.cz/brrr.php?";

        $("#registrace").click(function() {

    	var fullname=$("#fullname").val();
    	var email=$("#email").val();
    	var password=$("#password").val();
    	var dataString="fullname="+fullname+"&email="+email+"&password="+password+"&registrace=";

        
        if($.trim(fullname).length>0 & $.trim(email).length>0 & $.trim(password).length>0)
		{

			$.ajax({
				type: "GET",
				url: url,
				data: dataString,
				crossDomain: true,
				cache: false,
				beforeSend: function(){ $("#registrace").text('Connecting...');},
				success: function(data){
					date = data.trim();
					data = data.replace(/(\r\n|\n|\r)/gm,"");
					var datahelp = data;
					data = data.substr(0,7);
					if(data=="success")
					{
					var userid = datahelp.substring(7);
					localStorage.userid = userid;
				    localStorage.fullname = fullname;
				    localStorage.email = email;
					$("#registration").hide("slow");

					loadWifiTemp();
						}
					else if(data=="exist")
					{
						alert("Hey! You alreay has account! you can login with us");
					}
					else if(data=="failed")
					{
						alert("Something Went wrong");
					} 
				}
			});
		}
		return false;
;
    });
    

	$("#profileForm").submit(function(e){    
        e.preventDefault();  
        $.post("http://localhost/process_form.php", $("#profileForm").serialize(),
        function(data){
            if(data.email_check == 'invalid'){
             
                $("#message_post").html("<div class='errorMessage'>Sorry " + data.email + " is NOT a valid e-mail address. Try again.</div>");
            } else {
                $("#message_post").html("<div class='successMessage'>" + data.email + " is a valid e-mail address. Thank you.</div>");
                }
        }, "json");    
    });


    $("#createAccount").click(function(e){ 
		$("#CreateProfile").hide();
	});


	$("#ShowCreateProfile").click(function(){
		if ($(".StepCreateProfile").css('height') == '0px' ) {
			$('.StepCreateProfile').animate({"height": "100%"}, 400);
			$('.StepsBackground').animate({"margin-left": "2%"}, 400);
			$('.StepsBackground').animate({"width": "96%"}, 400);
			$("#CreateProfile").fadeIn(1000);
		} else {

			/*$('.StepsBackground').animate({"width": "55%"}, 800);*/
			$('.StepsBackground').animate({"width": "55%"}, 400);
			$('.StepsBackground').css("margin-left","auto");
			$('.StepsBackground').animate({"margin-right": "2%"}, 400);
			$('.StepCreateProfile').animate({"height": "0px"}, 500);
			$("#CreateProfile").hide();

		}
    	//$("#CreateProfile").toggle(300);
    	
	});
	$("#form-registration-form-sex").change(function() {
		validateSex();
	});
	$("#emailLogin").focusout(function() {
    	verifyEmail();
    });

	$("#form-registration-form-password_checker").focusout(function() {
		validatePassword();
	});
	$("#phoneNumber").focusout(function() {
		validatePhoneNumber();
	});


	$("#phoneNumber").keyup(function () {     
  	this.value = this.value.replace(/[^0-9\.]/g,'');
	});

	$("#nextPageProfile1").click(function() {
	

		if (  (validatePassword() & validatePhoneNumber() & validateEmailNotNull() & validateSex() ) )  {
			var h = $(".StepCreateProfile").height();
			$(".StepCreateProfile").height(h);
			//$("#profiletable1").animate({"margin-right": "100%"},400)
			//$("#profiletable1").animate({"width": "0"},400)
			//$("#profiletable1").fadeOut(500);
			//$("#profiletable1").hide('slide', {direction: 'left'}, 1000);
			//$("#CreateProfile").toggle("slide", { direction: "left" }, 1000);
			$("#profiletable1").animate({ opacity: 0 },500, function(){
					$("#profiletable1").hide();
					$("#profiletable2").fadeIn(500, function() {
						$('.StepCreateProfile').animate({"height": h/4}, 2000).animate({"height": "100%"});

					});
       		    }
			);
			//$("#profiletable1").fadeOut(2000);
			//$("#profiletable1").hide("slide", { direction: "up" }, 1000);

			//$('#profiletable1').animate({"height": "0px"}, 300);
			//$("#profiletable1").fadeOut(300);
			//$("#profiletable2").fadeIn(1000);
			//$("#StepCreateProfile").animate({"height": "auto"},400);
						//$('.StepCreateProfile').animate({"height": "100%"}, 4000);

		//$("#profiletable2").fadeIn(500);

//			$('.StepsBackground').animate({"width": "55%"}, 400);
//			$('.StepsBackground').css("margin-left","auto");
//			$('.StepsBackground').animate({"margin-right": "2%"}, 400);
//			$('.StepCreateProfile').animate({"height": "0px"}, 500);
//			$("#CreateProfile").hide(500);
		} 
	});
});

function loadWifiTemp() {
	$("#wifitemp").show("slow");
	$("#welcomename").text(localStorage.fullname);
	var xmlhttp = new XMLHttpRequest();
    var url = "http://brrr.cz/brrr.php?getwifitemps=yes&userid="+localStorage.userid;
    //var url = "http://brrr.cz/brrr.php?getwifitemps=yes&userid=825";

    xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	var listOfTS = JSON.parse(xmlhttp.responseText);
        	displayTS(listOfTS);
    	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function displayTS(listOfTS) {
    var out = "";
    var i;
    for(i = 0; i < listOfTS.length; i++) {
        out += '<span>' + listOfTS[i].ssid + '</span><span>' + listOfTS[i].location + '</span><br>';
    }
    if (listOfTS.length == 0) {
    	out = "Nemáte zatím žádné zaregistrované teploměry";
    }
    $("#listOfTS").html(out);
}

function delme() {
	$.ajax({
				type: "GET",
				url: url,
				data: dataString,
				crossDomain: true,
				cache: false,
				beforeSend: function(){ $("#registrace").text('Connecting...');},
				success: function(data){
					date = data.trim();
					data = data.replace(/(\r\n|\n|\r)/gm,"");
					if(data=="success")
					{
					$("#registration").hide("slow");
					loadWifiTemp();
						}
					else if(data=="exist")
					{
						alert("Hey! You alreay has account! you can login with us");
					}
					else if(data=="failed")
					{
						alert("Something Went wrong");
					} 
				}
			});
}




function verifyEmail() {
	var emailValue =  $("#emailLogin").val();
	if (isEmpty(emailValue)) {
		 $("#email_error_message").text("Promiňte, ale nezadali jste žádný email, prosím vyplň svůj e-mail.");
    		$("#email_error_message").show(500);
	} else {
			var posting = $.post("http://localhost/process_form.php", { email_profile : emailValue }, function(data){
            	if(data.email_check == 'invalid'){
                	$("#email_error_message").text("Promiňte, ale váš " + data.email + " není platná emailová adresa, prosím překontrolujte.");
                	$("#email_error_message").show(500);
                } else {
                	$("#email_error_message").hide(500);
                }
        	}, "json");
	}
}

function isEmpty(str) {
  return (!str || 0 === str.length);
}

function validateSex() {
	var valuesex = $('select[name=sex]').val();
	if (!( (valuesex=='M') || (valuesex=='Z') )) {
		 $("#sex_error_message").text("Promiňte, ale vyberte jestli jste muž nebo žena..");
    	 $("#sex_error_message").show(500);
	} else {
		$("#sex_error_message").fadeOut(500);
		return true;
	} 

}

function validateEmailNotNull() {
	var emailValue =  $("#emailLogin").val();
	if (isEmpty(emailValue)) {
		 $("#email_error_message").text("Promiňte, ale nezadali jste žádný email, prosím vyplň svůj e-mail.");
    	 $("#email_error_message").show(500);
    	 return false;
	} else { 
       	$("#email_error_message").fadeOut(500);
		return true;}
}

function validatePassword() {

  var a=$("#form-registration-form-password").val();
  var b=$("#form-registration-form-password_checker").val();
  if(!(a==b))
  {
    $("#password_error_message").text("Omlouváme se, ale uvedené hesla se neshodují. Zkuste to znova.");
    $("#password_error_message").show(500);
    return false;
  } else {
  	$("#password_error_message").fadeOut(500);
  	if ( $("#form-registration-form-password").val() == "") {
  		 $("#password_error_message").text("Omlouváme se, ale není uvedeno žádné heslo.");
  		 $("#password_error_message").fadeIn(500);
    	 return false;
  	}
  	return true;
  }
}

function validatePhoneNumber() {
	if ($('#phoneNumber').val().length < 9) {    
    	$("#phone_error_message").text("Omlouváme se, ale telefonní číslo musí mít nejméně 9 číslic.");
    	$("#phone_error_message").show(500);
    	return false;
	} else {
		$("#phone_error_message").fadeOut(500);
		return true;
	}
}

