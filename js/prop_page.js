$(document).ready(function() {
    var favouriteProperties;
    $(".status").css("display", "none");

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
     * this function enables the user to return to
     * the search page with the same search criteria
     */
    var propertyId = "";
    $(".return").on("click", function() {
        window.history.back();
    });

    /**
     * this function sets the components with the id 'tabs' to a jQuery styled tab system
     * it also ensures the first tabs is open when page is loaded
     */
    $(function() {
        $("#tabs").tabs({
            active: 0
        });
    });

    /**
     * This function enables parameters passed in the URL to be retrieved and stored into another variable.
     * This makes it easier to create a page for the property dynamically because we only need the
     * 'id' value to know what property to display.
     * So when property details are displayed it will be the same page displayed each time, but with 
     * different properties.
     * It also gives me the ability to add more than one parameter if need be.
     */
    function getUrlParameter(param) {
        var pageURL = window.location.search.substring(1);
        var UrlVariables = pageURL.split('&');
        for (var i = 0; i < UrlVariables.length; i++) {
            var parameterName = UrlVariables[i].split('=');
            if (parameterName[0] == param) {
                return parameterName[1];
            }
        }
    }

    propertyId = getUrlParameter('id');

    /**
     * this section of code checks for a match between data in the JSON scipt and the id passed in the URL
     * If it matches, it will take the values from the JSON script and stores them into variables.
     * it then displays the relevant values on the page
     */

     //this function was removed because of chrome not allowing getJSON() calls on local file systems
     //so for the sake of testing, it was removed and the JSON data was made internally accessable.
    // $.getJSON('properties.json', function(data) {
    var output = "<ul>";
    for (var i in data.properties) {
        if (propertyId == data.properties[i].id) {
            var heading = data.properties[i].location;
            var tenure = data.properties[i].tenure;
            var bedrooms = data.properties[i].bedrooms;
            var price = numberWithCommas(data.properties[i].price);
            var date = data.properties[i].added.day + " " + data.properties[i].added.month + " " + data.properties[i].added.year;

            $(".property-heading").text(heading);
            $(".tenure-detail").html("Tenure: " + tenure);
            var listDetails = "<ul class='prop-page-list'>" + "<li class='image-icon' id='image-icon'><div class='sprite bed-image'><div></li>" + "<li class='item'>Bedrooms: " + bedrooms + "</li>" + "<li class='image-icon' id='image-icon'><div class='sprite price-image'><div></li>" + "<li class='item'>Price: &pound;" + price + "</li>" + "<li class='image-icon' id='image-icon'><div class='sprite added-image'><div></li>" + "<li class='item'>Added: " + date + "</li>" + "</ul>";
            $(".property-details").html(listDetails);
            var propertyDescription = data.properties[i].description;
            var shortDescription = smartTrim(propertyDescription, 430, '.', '.');
            $(".main-description").html(shortDescription);

            $(".image1").attr("src", data.properties[i].image1);
            $(".image2").attr("src", data.properties[i].image2);
            $(".image3").attr("src", data.properties[i].image3);
            $(".image4").attr("src", data.properties[i].image4);
            $(".image5").attr("src", data.properties[i].image5);
            $(".image6").attr("src", data.properties[i].image6);

            $(".tmb1").attr("src", data.properties[i].smallImg1);
            $(".tmb2").attr("src", data.properties[i].smallImg2);
            $(".tmb3").attr("src", data.properties[i].smallImg3);
            $(".tmb4").attr("src", data.properties[i].smallImg4);
            $(".tmb5").attr("src", data.properties[i].smallImg2);

            $("#description-tab").html(propertyDescription);
            var propertyFloorPlan = "<img src='" + data.properties[i].floorplan + "'>";
            $("#floorplan-tab").html(propertyFloorPlan);

            output += "<li><img src='" + data.properties[i].picture + "'><br>" + data.properties[i].location + data.properties[i].type + " <br>  <a href='property-details.html?id=" + data.properties[i].id + "'>Go to " + data.properties[i].type + "'s home page</a></li>";
        }
    }

    /**
     * this function is triggered when the remove-fav button is clicked.
     * It first checks if there are any favourites stored, If it is empty the function will be stopped.
     * If not it will loop through all favourite values checking for a match with the URL parameter value
     * When one is found it will be removed with the 'pop()' function
     * The user will also be displayed a message about any issues that occur.
     */
    $(".remove-fav").on("click", function() {
        favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
        if (favouriteProperties == "" || favouriteProperties == null) {
            $(".status").css("display", "block")
            $(".status").text("Property does not exist in favourites.");
            return;
        }

        for (var j = 0; j < favouriteProperties.length; j++) {

            if (favouriteProperties[j] == propertyId) {
                favouriteProperties.pop(propertyId);
                localStorage.setItem("favProperty", JSON.stringify(favouriteProperties));
                $(".status").css("display", "block")
                $(".status").text("Property has been removed from favourites.");
            } else {
                $(".status").css("display", "block")
                $(".status").text("Property is not set as a favourite.");
            }
        }
    });

    /**
     * This function simply clears all favourites that are held in localStorage
     * this is done with the 'clear()' function.
     */
    $(".clear-fav").on("click", function() {
        $(".status").css("display", "block");
        $(".status").text("Your favourites have been cleared.");
        favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
        if (favouriteProperties == null) {
            return;
        }
        localStorage.clear();
    });

    /**
     * This method is responsible for saving properties to localStorage.
     * It first checks if the property already exists in localStorage, by comparing the
     * id parameter passed in the URL to the local storage array.
     * If no match is found it will then save the property with the aid of the 'push()'
     * function. If any errors occur the console's log will be written to, but the user
     * will not see this. However they will be alerted when the property is stored.
     */
    $(".save").on("click", function() {
        $(".status").css("display", "block")
        $(".status").text("This property has been stored to favourites.");
        try {
            favouriteProperties = JSON.parse(localStorage.getItem("favProperty"));
            if (favouriteProperties == null) {
                favouriteProperties = [];
            }

            for (var j = 0; j < favouriteProperties.length; j++) {
                if (propertyId == favouriteProperties[j]) {
                    $(".status").css("display", "block");
                    $(".status").text("This item already exists in the favourites list.");
                    return;
                } else {
                    $(".status").css("display", "block")
                    $(".status").text("This property has been stored to favourites.");
                }
            }

            favouriteProperties.push(propertyId);
            localStorage.setItem("favProperty", JSON.stringify(favouriteProperties));

        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                console.log("Error: limit reached for local storage");
            } else {
                console.log("Error:Saving to local storage");
            }
        }
    });
});

// });
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
 *------------------------------------------------------
 *  JSON FILE VALUES FOR THE PROPERTY DISPLAY PAGE
 * -----------------------------------------------------
 */   
var data = {
    "properties": [{
            "id": "prop10",
            "type": "Flat",
            "bedrooms": 1,
            "price": 50605,
            "tenure": "Freehold",
            "description": "Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location": "Ilford East London E9",
            "picture": "images/prop1pic1small.jpg",
            "url": "properties/prop9.html",
            "floorplan": "images/floor1.png",
            "image1": "images/prop1pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop1",
            "type": "Flat",
            "bedrooms": 3,
            "price": 150000,
            "tenure": "Freehold",
            "description": "Set back from the road on a secure gated drive, this generous three bedroom house is situated within a large secluded plot and provides impressive entertaining space and fantastic period features alongside contemporary fixtures and fittings. It comprises a reception room, a dining room, a conservatory, a study, a kitchen, a utility room, four bedrooms with en suite facilities, two additional bedrooms, a bathroom, a guest cloakroom, a sauna, a lovely south-facing garden, a garage and extensive off-street-parking. Located on sought-after Petts Wood Road, this beautiful property is also within easy reach of a variety of amenities, while benefiting from a sense of privacy.",
            "location": "Petts Wood Road, Petts Wood, Orpington",
            "picture": "images/prop2pic1small.jpg",
            "url": "properties/prop1.html",
            "floorplan": "images/floor2.png",
            "image1": "images/prop2pic1.jpg",
            "image2": "images/prop2pic2.jpg",
            "image3": "images/prop2pic3.jpg",
            "image4": "images/prop2pic4.jpg",
            "image5": "images/prop2pic5.jpg",
            "image6": "images/prop2pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "January",
                "day": 12,
                "year": 2014
            }
        }, {
            "id": "prop2",
            "type": "Flat",
            "bedrooms": 2,
            "price": 299995,
            "tenure": "Freehold",
            "description": "This outstanding seven bedroom house is arranged over six floors and features stunning accommodation with generous proportions, integrated air conditioning and audio systems and two lovely decked terraces. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "Old Market Street W6 BR6",
            "picture": "images/prop2pic1small.jpg",
            "url": "properties/prop2.html",
            "floorplan": "images/floor3.png",
            "image1": "images/prop2pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop6",
            "type": "Flat",
            "bedrooms": 3,
            "price": 299995,
            "tenure": "Freehold",
            "description": "This three bedroom stucco-fronted freehold house is finished to an exceptional standard and boasts substantial living space and a sought-after Orpington address. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location": "Crofton Road Orpington BR6",
            "picture": "images/prop2pic1small.jpg",
            "url": "properties/prop6.html",
            "floorplan": "images/prop1Plan.png",
            "image1": "images/prop2pic1.jpg",
            "image2": "images/prop2pic2.jpg",
            "image3": "images/prop2pic3.jpg",
            "image4": "images/prop2pic4.jpg",
            "image5": "images/prop2pic5.jpg",
            "image6": "images/prop2pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "June",
                "day": 21,
                "year": 2014
            }
        },

        {
            "id": "prop3",
            "type": "House",
            "bedrooms": 4,
            "price": 550000,
            "tenure": "Leased",
            "description": "This outstanding four bedroom detached house boasts an indoor swimming pool, six en suites, a separate two bedroom detached cottage, an extensive garden and ample off-street parking. Built for the over 55's O'Gradys offer this very well kept one double bedroom ground floor apartment with a modern fitted kitchen and bathroom, French doors leading to communal gardens and the added benefits of an on site warden, off street parking and communal lounge and laundry room. Fitted wall and base units with contrasting roll edge worktops, stainless steel sink/drainer unit with mixer tap, electric cooker point, space for fridge/freezer, tiled floor, partly tiled walls, double glazed window to front aspect.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "East India Road Poplar E14",
            "picture": "images/prop1pic1small.jpg",
            "url": "properties/prop3.html",
            "floorplan": "images/prop2Plan.jpg",
            "image1": "images/prop1pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop4",
            "type": "House",
            "bedrooms": 3,
            "price": 700995,
            "tenure": "Freehold",
            "description": "Ideal for first time buyers and investors - available chain free this studio apartment located close to Waltham Cross BR station and shopping facilities.  Comprising a fully fitted kitchen and bathroom, a large living area overlooking views of Lea Valley park and benefiting from own allocated parking and ample communal parking. Fitted wall and base units with roll edge worktops, electric oven and hob, extractor, space for fridge/freezer, plumbed for washing machine, stainless steel sink/drainer unit, tiled splash backs, tiled floor.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "Devons Road Bow E3",
            "picture": "images/prop1pic1small.jpg",
            "url": "properties/prop4.html",
            "floorplan": "images/floor1.png",
            "image1": "images/prop1pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop5",
            "type": "House",
            "bedrooms": 4,
            "price": 900995,
            "tenure": "Freehold",
            "description": "Offering a wealth of high-tech features, this beautifully presented six bedroom house affords spacious and bright interiors, en suite facilities, a terrace and a garage. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "Tottenham Court Road London W1",
            "picture": "images/frontage4.png",
            "url": "properties/prop5.html",
            "floorplan": "images/floor2.png",
            "image1": "images/prop2pic1.jpg",
            "image2": "images/prop2pic2.jpg",
            "image3": "images/prop2pic3.jpg",
            "image4": "images/prop2pic4.jpg",
            "image5": "images/prop2pic5.jpg",
            "image6": "images/prop2pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "July",
                "day": 14,
                "year": 2013
            }
        }, {
            "id": "prop7",
            "type": "House",
            "bedrooms": 7,
            "price": 1900995,
            "tenure": "Freehold",
            "description": "Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "Park Lane Central London W1",
            "picture": "images/front2.png",
            "url": "properties/prop7.html",
            "floorplan": "images/floor3.png",
            "image1": "images/prop1pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop8",
            "type": "House",
            "bedrooms": 10,
            "price": 1390995,
            "tenure": "Freehold",
            "description": "This stunning ten bedroom house is set on Kingston upon Thames and has recently been refurbished to offer state-of-the-art accommodation, including a swimming pool, open-plan living space and a driveway. Presented in excellent decorative order throughout is this two double bedroom, two bathroom, garden flat. <br>The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee...",
            "location": "Kingston upon Thames ER14",
            "picture": "images/prop2pic1small.jpg",
            "url": "properties/prop8.html",
            "floorplan": "images/prop1Plan.png",
            "image1": "images/prop2pic1.jpg",
            "image2": "images/prop2pic2.jpg",
            "image3": "images/prop2pic3.jpg",
            "image4": "images/prop2pic4.jpg",
            "image5": "images/prop2pic5.jpg",
            "image6": "images/prop2pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "March",
                "day": 14,
                "year": 2014
            }
        }, {
            "id": "prop9",
            "type": "House",
            "bedrooms": 8,
            "price": 3000995,
            "tenure": "Freehold",
            "description": "This eight bedroom property is elegantly arranged over six floors and boasting ample living space throughout, bright interiors and a high-quality finish, this stunning six bedroom house is situated in the heart of Mayfair. The modern fitted kitchen is open plan to the living room which boasts solid wooden floors and includes integrated appliances including a dishwasher & a washing machine. This large open plan benefits from bi folding doors onto a secluded private courtyard garden. Both bedrooms are double sized, and the family bathroom boasts a matching three piece suite a shower attachment over the bath. There is also a separate wet room. There are walnut doors throughout and wiring for Sky TV/aerial points in the living room/kitchen and both bedrooms.<br>This apartment being only five years old, is still under a 10 year building guarantee.",
            "location": "Hackney East London E9",
            "picture": "images/prop1pic1small.jpg",
            "url": "properties/prop9.html",
            "floorplan": "images/prop2Plan.jpg",
            "image1": "images/prop1pic1.jpg",
            "image2": "images/prop1pic2.jpg",
            "image3": "images/prop1pic3.jpg",
            "image4": "images/prop1pic4.jpg",
            "image5": "images/prop1pic5.jpg",
            "image6": "images/prop1pic6.jpg",
            "smallImg1": "images/prop1pic1small.jpg",
            "smallImg2": "images/prop1pic2small.jpg",
            "smallImg3": "images/prop1pic3small.jpg",
            "smallImg4": "images/prop1pic4small.jpg",
            "smallImg5": "images/prop1pic5small.jpg",
            "smallImg6": "images/prop1pic6small.jpg",
            "added": {
                "month": "September",
                "day": 14,
                "year": 2014
            }
        }
    ]
}