

$(document).ready(function(){


	$("#search").on("click", function(){

		var userDept = $("input:checked").val();
		var output = "<ul>";
		for (var i in data.users) {

			if((userDept == data.users[i].dept)|| (userDept == "Any")){
				output += "<li>" + data.users[i].firstName + "    "+ data.users[i].lastName + "   " + data.users[i].joined.month + "   <a href='"+data.users[i].id + ".html'>Go to "+data.users[i].firstName+"'s home page</a></li>";
			 }
		}
		output += "</ul>";
		document.getElementById("placeholder").innerHTML = output;
	});
	$(".save").on("click", function(){
		try{
			$(this).attr("disabled",true);

		var staffIdToAdd = $(this).closest("p").attr("id");
		var myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
		if(myFavouriteStaff == null){

			myFavouriteStaff = [];
		}
			
			 	for (var j = 0; j < myFavouriteStaff.length; j++) {
			 		if(staffIdToAdd == myFavouriteStaff[j]){
			 			$(".status").text("This item is already in the favourites list");
			 			return;
			 		}
			 	}

			myFavouriteStaff.push(staffIdToAdd);
		localStorage.setItem("favStaff", JSON.stringify(myFavouriteStaff));
		
		
	}catch(e){
		if(e == QUOTA_EXCEEDED_ERR){
			console.log("Error: limit reached for local storage");
		}else{
			console.log("Error:Saving to local storage");
		}
	}
		
	});


	$(".favourites").on("click",function(){
		console.log("Restoring array data from local storage");

	 myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
	 output = "<ul>";
	 if(myFavouriteStaff != null){
		for (var i = 0;i< data.users.length;i++) {
			 	for (var j = 0; j < myFavouriteStaff.length; j++) {
			 		if(data.users[i].id == myFavouriteStaff[j]){
			 			output += "<li>" + data.users[i].firstName + "    "+ data.users[i].lastName + "</li><li>" + data.users[i].joined.month + "</li><li><a href='"+data.users[i].id + ".html'>Go to "+data.users[i].firstName+"'s home page</a></li><hr>";
			 		}
			 	}
		}

	 }

output += "</ul>";
document.getElementById("placeholder").innerHTML = output;
	});

	$(".return").on("click", function(){
		 window.history.back()
	}) ;

	$(".removeFav").on("click", function(){
	var staffIdToAdd = $(this).closest("p").attr("id");
		var myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
if(myFavouriteStaff == null){
myFavouriteStaff = [];
}
		localStorage.removeItem(staffIdToAdd);
		for (var j = 0; j < myFavouriteStaff.length; j++) {
			 		if(staffIdToAdd == myFavouriteStaff[j]){
			
			 			return;
			 		}
			 	}
	}) ;

	$(".clearFav").on("click", function(){
		 myFavouriteStaff = JSON.parse(localStorage.getItem("favStaff"));
		if(myFavouriteStaff == null){
			return;
		}
		localStorage.clear();
	}) ;
});


