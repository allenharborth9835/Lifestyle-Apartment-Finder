/*--------------------------------------------[api-logic] Pseudocode/input and output/functional structure-----------------------------------------------------------------------------------------------------------------------------------------------------------------

    [framework-logic] will collect and validate user input values relavent to the API code logic [api-logic] presented below...

    Expected input from framework-logic:
    1) user work address-> datatype = string
    2) user's radial distance of choice from work address postal code -> datatype = integer
    3) user apartment choice -> datatype = integer(s)- location coordinates of apartment choice (once listings populate for user in the framework-logic)

    Expected output from API-logic:
    1) apartment listings with relevant parameters for each listing (i.e. address, price, locational coordinates)
    2) travel distance (driving) between user work address and user chosen apartment address (can also output travel times as an added future feature)
    3) "map tile" using apartment and work locational coordinates
    4) (optional) could add gas price API here and output gas bill, if needed to handle this functionality in the API schema

    Functions/arguments:
    1) distanceMatrix(startCoordinateLat, startCoordinateLng, endCoordinateLat, endCoordinateLng)
    2) geoCode(addressToConvert)
    3) reverseGeocode(coordinatelat, coordinateLng)
    4) searchListings(areaCode, stateCode, city, searchRadius)
    5) calcCommute(userWorkAddress, listingLat, listingLng)
    6) (optional)calcGasBill()

    API(s):
    1) TrueWay Matrix API
    2) TrueWay Geocoding API (geocoding)
    3) TrueWay Geocoding API (reverse geocoding)
    4) Reality in US API
    6) (optional) gas price API for calculation of user's estimated monthly gas bill (commute to and from work)

    Pseudocode/use statement:
    1) In [framework-logic], prompt user for work address + desired radius (in miles) for apartment listing search (retrieve address string + radius integer)
    2) In [framework-logic], parse user work address string to caputure work address area code, state, city
    3) In [framework-logic], call searchListings() in [api-logic] using parsed string result (area code, state, and city) + searchRadius (from user) as arguments-> searchListings() returns apartmentListings object (contains array of listings objects)
    4) In [framework-logic], traverse apartmentListings object to display listings (with pricing) to user in web app, have user choose listing, return location coordinates (parameters available in listings object)
    5) In [framework-logic], call calcCommute() in [api-logic]- passing chosen apartment location coordinates (step 4) + user work address as a string
    6) In [api-logic], calcCommute returns a 2 dimensional array of distance and commute time data (in meters and seconds-see API-mapping.md for more info) for use in either [framework logic] or in [api-logic] where a function can be called to calulate the users estimate gas bill (calcGasBill())
    7) In [api-logic], figure out a way to display work address and chosen appartment address using a map "tile" using OpenLayers map library (At least for MVP, can be updated with other mapping features later)

    Use Statement:
    [api-logic] is designed to be modular and adaptive to the needs of the web app [framework-logic], therefore list functions can be used individually as needed, and can be readily modified as needed
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations
function distanceMatrix(/*startCoordinateLat, startCoordinateLng, endCoordinateLat, endCoordinateLng*/){
    fetch("https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=40.629041%2C-74.025606%3B40.630099%2C-73.993521%3B40.644895%2C-74.013818%3B40.627177%2C-73.980853&destinations=40.629041%2C-74.025606%3B40.630099%2C-73.993521%3B40.644895%2C-74.013818%3B40.627177%2C-73.980853", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914",
		"x-rapidapi-host": "trueway-matrix.p.rapidapi.com"
	    }
    })
    .then(function(response){
	return response.json();
    })
    .then(function(data){
    console.log(data);
    })
    .catch(err => {
	console.error(err);
    });

}

//function that accepts an address string, then uses the TrueWay Geocoding API to convert the address string into map coordinates {latitude, longitude}
function geoCode(/*addressToConvert*/){
    fetch("https://trueway-geocoding.p.rapidapi.com/Geocode?address=505%20Howard%20St%2C%20San%20Francisco&language=en", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914",
		"x-rapidapi-host": "trueway-geocoding.p.rapidapi.com"
	    }
    })
    .then(function(response){
	return response.json();
    })
    .then(function(data){
    console.log(data);
    })
    .catch(err => {
	console.error(err);
    });
}

//function that accepts map coordinates {latitude, longitude}, then uses the TrueWay Geocoding API to convert the map coordinates into and address string
function reverseGeocode(/*coordinatelat, coordinateLng*/){
    fetch("https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=37.7879493%2C-122.3961974&language=en", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914",
		"x-rapidapi-host": "trueway-geocoding.p.rapidapi.com"
	    }
    })
    .then(function(response){
	return response.json();
    })
    .then(function(data){
    console.log(data);

    //example data for eventual function return statement
    console.log(data.results[0].address);
    })
    .catch(err => {
	console.error(err);
    });
}

//function that accepts an area code, state, city, search radius, and number of desired listings to return from Reality in us API
function searchListings(/*areaCode, stateCode, city, searchRadius*/){
    //note that we only have 500 API calls per month with this API (hard limit)
    fetch("https://realty-in-us.p.rapidapi.com/properties/list-for-rent?state_code=TX&city=Austin&limit=50&offset=0&sort=relevance&radius=25", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914",
		"x-rapidapi-host": "realty-in-us.p.rapidapi.com"
	    }
    })
    .then(function(response){
	return response.json();
    })
    .then(function(data){
    console.log(data);
    //package relevant listing parameters into a condensed apartmentListings object, which holds an array of listing objects
    
    })
    .catch(err => {
	console.error(err);
    });
}

//insert "Map Tile" API code here if there is time to integrate it into the MVP


/*----------------Uncommment to Test APIs------------------------------------
//distanceMatrix();
//Geocode();
//reverseGeocode();
//searchListings();
---------------------------------------------------------------------------*/

//accepts user work address string and chosen apartment listing coordinates {lat, lng}
function calcCommute(/*userWorkAddress, listingLat, listingLng*/){

}
