$(document).ready(function() {

	//this function toggles the menu-active class when ever the menu icon in header is clicked
	$('.menu-anchor').on('click touchstart', function(e) {
		$('html').toggleClass('menu-active');
		e.preventDefault();
	});

    /**
     * this function acts in conjuction with the above function
     * but it allows you to click anywhere outside of the menu icon and the menu-active class
     * will be removed, this will result in the page going back to its default position
     */
	$('.main').on('click touchstart', function(e) {
		$('html').removeClass('menu-active');
	});

    /**
     * This function creates the jQuery dropdown menu and buttonset
     */
	$(function() {
		$(".price-max").selectmenu();
		$(".price-min").selectmenu();
		$(".room-max").selectmenu();
		$(".room-min").selectmenu();
		$(".prop-type-radioset").buttonset();
		$(".btn").button();
	});

     //this function was removed because of chrome not allowing getJSON() calls on local file systems
     //so for the sake of testing, it was removed and the JSON data was made internally accessable.
	// $.getJSON('properties.json', function(data) {
		var propertyArr = [];
		for (var i in data.properties) {
			propertyArr[i] = data.properties[i].type;
		}

        /**
         * This section of code is responsible for searching the JSON data for values passed from 
         * the drop down boxes and radio buttons.
         * It first replaces the string values with integers.
         * It then sets conditions set by the user in its search through the data.
         * When a property meets all conditions it is displayed to the user by way of a set placeholder.
         * If nothing is found the user will be notified.
         */
		$(".search").on("click", function() {
            //this line gets the value from the buttonset
			var propertyType = $(".prop-type-radioset :radio:checked + label").text();
			var minPrice = $(".price-min").val();
			var maxPrice = $(".price-max").val();
			var maxRoom = $(".room-max").val();
			var minRoom = $(".room-min").val();
			if (minPrice != "No Min") {
				minPrice = parseInt(minPrice.replace(/,/g, ''));
			}
			if (maxPrice != "No Max") {
				maxPrice = parseInt(maxPrice.replace(/,/g, ''));
			}
			if (minPrice == "No Min") {
				minPrice = 0;
			}
			if (maxPrice == "No Max") {
				maxPrice = 99999999999;
			}
			if (minRoom == "No Min") {
				minRoom = 0;
			}
			if (maxRoom == "No Max") {
				maxRoom = 99999999999;
			}

			if (propertyType == "All") {
				var display = "<h3 class='search-head'>" + propertyType + " properties</h3>";
			} else {
				display = "<h3 class='search-head'>" + propertyType + "s</h3>";
			}

			for (var i in data.properties) {
                //conditions set by the user
				if (((propertyType == "All") || (propertyType == propertyArr[i])) && (data.properties[i].bedrooms >= minRoom) && (data.properties[i].bedrooms <= maxRoom) && (data.properties[i].price >= minPrice) && (data.properties[i].price <= maxPrice)) {

					var price = numberWithCommas(data.properties[i].price);
					var description = data.properties[i].description;

					display += "<div class='property-detail'><div class='row'><div class='c2'><a href='property-details.html?id=" + data.properties[i].id + "'>" + "<img class='property-image' src='" + data.properties[i].picture + "'></a></div>" + "<div class='c8'><span class='prop-location'>" + data.properties[i].type + ":    " + data.properties[i].location + "</span>  " + "<p class='short-desc'>" + smartTrim(description, 330, ' ', '   ') + "<a class='property-link' href='property-details.html?id=" + data.properties[i].id + "'>&nbsp;&nbsp;More....</a></p></div>" + "<div class='c2 prop-price'><div class='pound sprite price-image'></div><span class='price-text'>&pound;" + price + "</span><div class='bedroom sprite bed-image'></div><span class='bed-text'>Bedroom: "+data.properties[i].bedrooms+"</span></div></div></div><div class='clr'></div>";
				}
			}

			document.getElementById("placeholder").innerHTML = display;
			// check for empty search results. 
			if (description == null) {
				var notFound = "<div class='not-found'>Sorry, we have no properties that fit the search criteria.</div>";
				document.getElementById("placeholder").innerHTML = notFound;
			}
		});

        /**
         * This function is responsible for obtaining values from local storage
         * and displaying them to the user.
         * It does this by looping through both the JSON file and the local storage array.
         * If the 'id' property matches in both arrays it is displayed as a favourite.
         */
		$(".favourites").on("click", function() {
			console.log("Restoring array data from local storage");
			favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
			output = "<ul>";
			if (favouriteProperties != null) {
				for (var i = 0; i < data.properties.length; i++) {
					for (var j = 0; j < favouriteProperties.length; j++) {
						if (data.properties[i].id == favouriteProperties[j]) {
							var price = numberWithCommas(data.properties[i].price);
							var description = data.properties[i].description;

							output += "<div class='property-detail'><div class='row'><div class='c2'><a href='property-details.html?id=" + data.properties[i].id + "'>" + "<img class='property-image' src='" + data.properties[i].picture + "'></a></div>" + "<div class='c8'><span class='prop-location'>" + data.properties[i].type + ":    " + data.properties[i].location + "</span>  " + "<p class='short-desc'>" + smartTrim(description, 330, ' ', '   ') + "<a class='property-link' href='property-details.html?id=" + data.properties[i].id + "'>  &nbsp;&nbsp;More....</a></p></div>" + "<div class='c2 prop-price'><div class='pound sprite price-image'></div><span class='price-text'>&pound;" + price + "</span><div class='bedroom sprite bed-image'></div><span class='bed-text'>Bedroom: "+data.properties[i].bedrooms+"</span></div></div></div><div class='clr'></div>";
						}
					}
				}
			}

			output += "</ul>";
			document.getElementById("placeholder").innerHTML = output;
			// check for empty search results. 
			if (description == null) {
				var notFound = "<div class='not-found'>You have no favourites at the moment.</div>";
				document.getElementById("placeholder").innerHTML = notFound;
			}
		});

		$(".clear-fav").on("click", function() {
			favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
			if (favouriteProperties == null) {
				return;
			}
			localStorage.clear();
		});
	});

// });

/**
 * this function removes the last word when the substring function
 * is used, instead of displaying half a word.
 * It was used for the short description of properties in the search
 */
function smartTrim(str, length, delim, appendix) {
	if (str.length <= length) return str;
	var trimmedStr = str.substr(0, length + delim.length);
	var lastDelimIndex = trimmedStr.lastIndexOf(delim);
	if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
	if (trimmedStr) trimmedStr += appendix;
	return trimmedStr;
}

/**
 * this function sets commas into an integer value of more
 * three digits. It uses regular expressions to achieve this.
 * It is used for displaying the property price
 */
function numberWithCommas(n) {
	var parts = n.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

/**
 *------------------------------------------------------
 *  JSON FILE VALUES FOR THE PROPERTY SEARCH PAGE
 * -----------------------------------------------------
 */
var data = { 
	"properties": [
        {
            "id":"prop10",
            "type":"Flat",
            "bedrooms":1,
            "price":50605,
            "tenure":"Freehold",
            "description":"Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location":"Ilford East London E9",
            "picture":"images/prop1pic1small.jpg",
            "url":"properties/prop9.html",
            "floorplan":"images/floor1.png",
            "image1":"images/prop1pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop1",
			"type":"Flat",
            "bedrooms":3,
			"price":150000,
			"tenure":"Freehold",
			"description":"Set back from the road on a secure gated drive, this generous three bedroom house is situated within a large secluded plot and provides impressive entertaining space and fantastic period features alongside contemporary fixtures and fittings. It comprises a reception room, a dining room, a conservatory, a study, a kitchen, a utility room, four bedrooms with en suite facilities, two additional bedrooms, a bathroom, a guest cloakroom, a sauna, a lovely south-facing garden, a garage and extensive off-street-parking. Located on sought-after Petts Wood Road, this beautiful property is also within easy reach of a variety of amenities, while benefiting from a sense of privacy.",
			"location":"Petts Wood Road, Petts Wood, Orpington",
			"picture":"images/prop2pic1small.jpg",
			"url":"properties/prop1.html",
            "floorplan":"images/floor2.png",
            "image1":"images/prop2pic1.jpg",
            "image2":"images/prop2pic2.jpg",
            "image3":"images/prop2pic3.jpg",
            "image4":"images/prop2pic4.jpg",
            "image5":"images/prop2pic5.jpg",
            "image6":"images/prop2pic6.jpg",
            "added": {
                "month":"January",
                "day":12,
                "year":2014
            }
        },
		{
            "id":"prop2",
			"type":"Flat",
            "bedrooms":2,
			"price":299995,
			"tenure":"Freehold",
			"description":"This outstanding seven bedroom house is arranged over six floors and features stunning accommodation with generous proportions, integrated air conditioning and audio systems and two lovely decked terraces. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
			"location":"Old Market Street W6 BR6",
			"picture":"images/prop2pic1small.jpg",
			"url":"properties/prop2.html",
            "floorplan":"images/floor3.png",
             "image1":"images/prop2pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop6",
            "type":"Flat",
            "bedrooms":3,
            "price":299995,
            "tenure":"Freehold",
            "description":"This three bedroom stucco-fronted freehold house is finished to an exceptional standard and boasts substantial living space and a sought-after Orpington address. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location":"Crofton Road Orpington BR6",
            "picture":"images/prop2pic1small.jpg",
            "url":"properties/prop6.html",
            "floorplan":"images/prop1Plan.png",
            "image1":"images/prop2pic1.jpg",
            "image2":"images/prop2pic2.jpg",
            "image3":"images/prop2pic3.jpg",
            "image4":"images/prop2pic4.jpg",
            "image5":"images/prop2pic5.jpg",
            "image6":"images/prop2pic6.jpg",
            "added": {
                "month":"June",
                "day":21,
                "year":2014
            }
        },
        
        {
            "id":"prop3",
            "type":"House",
            "bedrooms":4,
            "price":550000,
            "tenure":"Leased",
            "description":"This outstanding four bedroom detached house boasts an indoor swimming pool, six en suites, a separate two bedroom detached cottage, an extensive garden and ample off-street parking. Built for the over 55's O'Gradys offer this very well kept one double bedroom ground floor apartment with a modern fitted kitchen and bathroom, French doors leading to communal gardens and the added benefits of an on site warden, off street parking and communal lounge and laundry room. Fitted wall and base units with contrasting roll edge worktops, stainless steel sink/drainer unit with mixer tap, electric cooker point, space for fridge/freezer, tiled floor, partly tiled walls, double glazed window to front aspect.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location":"East India Road Poplar E14",
            "picture":"images/prop1pic1small.jpg",
            "url":"properties/prop3.html",
            "floorplan":"images/prop2Plan.jpg",
            "image1":"images/prop1pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop4",
            "type":"House",
            "bedrooms":3,
            "price":700995,
            "tenure":"Freehold",
            "description":"Ideal for first time buyers and investors - available chain free this studio apartment located close to Waltham Cross BR station and shopping facilities.  Comprising a fully fitted kitchen and bathroom, a large living area overlooking views of Lea Valley park and benefiting from own allocated parking and ample communal parking. Fitted wall and base units with roll edge worktops, electric oven and hob, extractor, space for fridge/freezer, plumbed for washing machine, stainless steel sink/drainer unit, tiled splash backs, tiled floor.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location":"Devons Road Bow E3",
            "picture":"images/prop1pic1small.jpg",
            "url":"properties/prop4.html",
            "floorplan":"images/floor1.png",
            "image1":"images/prop1pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop5",
            "type":"House",
            "bedrooms":4,
            "price":900995,
            "tenure":"Freehold",
            "description":"Offering a wealth of high-tech features, this beautifully presented six bedroom house affords spacious and bright interiors, en suite facilities, a terrace and a garage. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location":"Tottenham Court Road London W1",
            "picture":"images/frontage4.png",
            "url":"properties/prop5.html",
            "floorplan":"images/floor2.png",
            "image1":"images/prop2pic1.jpg",
            "image2":"images/prop2pic2.jpg",
            "image3":"images/prop2pic3.jpg",
            "image4":"images/prop2pic4.jpg",
            "image5":"images/prop2pic5.jpg",
            "image6":"images/prop2pic6.jpg",
            "added": {
                "month":"July",
                "day":14,
                "year":2013
            }
        },
        {
            "id":"prop7",
            "type":"House",
            "bedrooms":7,
            "price":1900995,
            "tenure":"Freehold",
            "description":"Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location":"Park Lane Central London W1",
            "picture":"images/front2.png",
            "url":"properties/prop7.html",
            "floorplan":"images/floor3.png",
            "image1":"images/prop1pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop8",
            "type":"House",
            "bedrooms":10,
            "price":1390995,
            "tenure":"Freehold",
            "description":"This stunning ten bedroom house is set on Kingston upon Thames and has recently been refurbished to offer state-of-the-art accommodation, including a swimming pool, open-plan living space and a driveway. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location":"Kingston upon Thames ER14",
            "picture":"images/prop2pic1small.jpg",
            "url":"properties/prop8.html",
            "floorplan":"images/prop1Plan.png",
            "image1":"images/prop2pic1.jpg",
            "image2":"images/prop2pic2.jpg",
            "image3":"images/prop2pic3.jpg",
            "image4":"images/prop2pic4.jpg",
            "image5":"images/prop2pic5.jpg",
            "image6":"images/prop2pic6.jpg",
            "added": {
                "month":"March",
                "day":14,
                "year":2014
            }
        },
        {
            "id":"prop9",
            "type":"House",
            "bedrooms":8,
            "price":3000995,
            "tenure":"Freehold",
            "description":"This eight bedroom property is elegantly arranged over six floors and boasting ample living space throughout, bright interiors and a high-quality finish, this stunning six bedroom house is situated in the heart of Mayfair. The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location":"Hackney East London E9",
            "picture":"images/prop1pic1small.jpg",
            "url":"properties/prop9.html",
            "floorplan":"images/prop2Plan.jpg",
            "image1":"images/prop1pic1.jpg",
            "image2":"images/prop1pic2.jpg",
            "image3":"images/prop1pic3.jpg",
            "image4":"images/prop1pic4.jpg",
            "image5":"images/prop1pic5.jpg",
            "image6":"images/prop1pic6.jpg",
            "added": {
                "month":"September",
                "day":14,
                "year":2014
            }
        }
]}