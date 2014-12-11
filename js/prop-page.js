$(document).ready(function(){
//this function toggles the menu-active class when ever the small menu icon is clicked
	$('.menu-anchor').on('click touchstart', function(e){
		$('html').toggleClass('menu-active');
	  	e.preventDefault();
	});
//this function acts in conjuction with the above function
//but it allows you to click anywhere outside of the menu icon and the menu-active class
//will be removed, this will result in the page going back to its default position
$('.main').on('click touchstart', function(e){
	$('html').removeClass('menu-active');
	});

var propertyId = "";
$(".return").on("click", function(){
		 window.history.back()
	}) ;
/**
 * This function enables me to retrieve the parameter from the URL,  this tells me which property 
 * should be displayed by the 'id' number
 */
function getUrlParameter(param)
{
    var pageURL = window.location.search.substring(1);
    var UrlVariables = pageURL.split('&');
    for (var i = 0; i < UrlVariables.length; i++) 
    {
        var parameterName = UrlVariables[i].split('=');
        if (parameterName[0] == param) 
        {
            return parameterName[1];
        }
    }
}  
	
propertyId = getUrlParameter('id');


$.getJSON('properties.json', function(data) {
var output = "<ul>";
 for (var i in data.properties) {
	if(propertyId == data.properties[i].id){
		output += "<li><img src='"+ data.properties[i].picture + "'><br>" + data.properties[i].location + data.properties[i].type + " <br>  <a href='property-details.html?id="+data.properties[i].id+"'>Go to "+data.properties[i].type+"'s home page</a></li>";
	}
}
output += "</ul>";
document.getElementById("property").innerHTML = output;



	$(".save").on("click", function(){
		try{
			$(this).attr("disabled",true);
		var favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
		if(favouriteProperties == null){

			favouriteProperties = [];
		}
			
			 	for (var j = 0; j < favouriteProperties.length; j++) {
			 		if(propertyId == favouriteProperties[j]){
			 			$(".status").text("This item is already in the favourites list");
			 			return;
			 		}
			 	}

			favouriteProperties.push(propertyId);
		localStorage.setItem("favProperty", JSON.stringify(favouriteProperties));
		
		
	}catch(e){
		if(e == QUOTA_EXCEEDED_ERR){
			console.log("Error: limit reached for local storage");
		}else{
			console.log("Error:Saving to local storage");
		}
	}
		
	});

});






});


