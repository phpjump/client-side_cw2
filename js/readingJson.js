$(document).ready(function(){

	$(function() {
    $( ".price-max" ).selectmenu();
    $( ".price-min" ).selectmenu();
    $( ".room-max" ).selectmenu();
    $( ".room-min" ).selectmenu();
    $( ".prop-type-radioset" ).buttonset();
    $( ".btn" ).button();
    
    // $(".submit").on("click","button",function(){
    //   var propertyType =  $(".prop-type-radioset :radio:checked + label").text();
    //   var minPrice = $(".price-min").val();
    //   var maxPrice = $(".price-Max").val();
    //   var maxRoom = $(".room-max").val();
    //   var minRoom = $(".room-min").val();
      // alert("You chose: " + propertyType + "\nMin rooms: " + minRoom + "\nMax rooms: "+maxRoom+"\nMin price: " + minPrice + "\nMax price: "+maxPrice );
    // });
});

  $.getJSON('properties.json', function(data) {
        var output=[]; 
        for (var i in data.properties) {
            output[i]= data.properties[i].type;
        }




$(".search").on("click", function(){


	 var propertyType =  $(".prop-type-radioset :radio:checked + label").text();
      var minPrice = $(".price-min").val();
      var maxPrice = $(".price-Max").val();
      var maxRoom = $(".room-max").val();
      var minRoom = $(".room-min").val();



		// var propertyType = $("input:checked").val();
		if(propertyType == "All"){
			var display = "<h4>"+propertyType+" properties</h4><ul>";
		}else{
			display = "<h4>"+propertyType+"s</h4><ul>";
		}
		
		for (var i in data.properties) {

			if((propertyType == output[i])|| (propertyType == "All")){
				display += "<li><img src='"+ data.properties[i].picture + "'><br>" + data.properties[i].location + data.properties[i].type + " <br>  <a href='property-details.html?id="+data.properties[i].id+"'>Go to "+data.properties[i].type+"'s home page</a></li>";
			 }
		}
		display += "</ul>";
		document.getElementById("placeholder").innerHTML = display;
	});

// 	$(".save").on("click", function(){
// 		try{
// 			$(this).attr("disabled",true);

// 		var staffIdToAdd = $(this).closest("p").attr("id");
// 		var myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
// 		if(myFavouriteStaff == null){

// 			myFavouriteStaff = [];
// 		}
			
// 			 	for (var j = 0; j < myFavouriteStaff.length; j++) {
// 			 		if(staffIdToAdd == myFavouriteStaff[j]){
// 			 			$(".status").text("This item is already in the favourites list");
// 			 			return;
// 			 		}
// 			 	}

// 			myFavouriteStaff.push(staffIdToAdd);
// 		localStorage.setItem("favStaff", JSON.stringify(myFavouriteStaff));
		
		
// 	}catch(e){
// 		if(e == QUOTA_EXCEEDED_ERR){
// 			console.log("Error: limit reached for local storage");
// 		}else{
// 			console.log("Error:Saving to local storage");
// 		}
// 	}
		
// 	});
// var favouriteProperties ="";

	$(".favourites").on("click",function(){
		console.log("Restoring array data from local storage");

	 favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
	 output = "<ul>";
	 if(favouriteProperties != null){
		for (var i = 0;i< data.properties.length;i++) {
			 	for (var j = 0; j < favouriteProperties.length; j++) {
			 		if(data.properties[i].id == favouriteProperties[j]){
			 			output += "<li><img src='"+ data.properties[i].picture + "'><br>" + data.properties[i].location + data.properties[i].type + " <br>  <a href='property-details.html?id="+data.properties[i].id+"'>Go to "+data.properties[i].type+"'s home page</a></li>";
			 		}
			 	}
		}

	 }

output += "</ul>";
document.getElementById("placeholder").innerHTML = output;
	});

// 	$(".return").on("click", function(){
// 		 window.history.back()
// 	}) ;

// 	$(".removeFav").on("click", function(){
// 	var staffIdToAdd = $(this).closest("p").attr("id");
// 		var myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
// if(myFavouriteStaff == null){
// myFavouriteStaff = [];
// }
// 		localStorage.removeItem(staffIdToAdd);
// 		for (var j = 0; j < myFavouriteStaff.length; j++) {
// 			 		if(staffIdToAdd == myFavouriteStaff[j]){
			
// 			 			return;
// 			 		}
// 			 	}
// 	}) ;

	$(".clearFav").on("click", function(){
		 favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
		if(favouriteProperties == null){
			return;
		}
		localStorage.clear();
	}) ;







  });









   });