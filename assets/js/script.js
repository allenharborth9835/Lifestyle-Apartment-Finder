/*[api-logic] Pseudocode

    [framework-logic] will register and validate user input values relavent to the API code logic presented below...

    1) user work address-> datatype = string
    2) user's radial distance of choice from work address postal code -> datatype = integer


*/




//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations
function distanceMatrix (){
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
function Geocode(){
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
function reverseGeocode(){
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


function searchListings(){
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
    })
    .catch(err => {
	console.error(err);
    });
}

//distanceMatrix();
//Geocode();
//reverseGeocode();
//searchListings();
