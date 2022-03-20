const fetch = require('node-fetch');

//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations (assuming user is driving a car)
let distanceMatrix = async function(origin, destination){

    //conversion factor = # of meters/mile
    const meterToMile = 1609.34;

    const fetchResultMatrix = await fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${origin.lat}%2C${origin.lng}&destinations=${destination.lat}%2C${destination.lng}`, {
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
        //for one location coordinate pair {lat, lng}, response is in the form of a 2D array ("distances" in meters or "durations" in seconds) with distance value at position [0][0]
        let commuteObj = {};
        commuteObj.commuteDistance = Math.round((data.distances[0][0])/ meterToMile);
        commuteObj.commuteTime = Math.round((data.durations[0][0])/60);

        //return commuteObj ={commuteDistance: X (miles, to nearest mile), commuteTime: Y (minutes, to nearest minute)}
        return commuteObj;
    })
    .catch(err => {
	console.error(err);
    });

    return fetchResultMatrix;
}

//function that accepts an address string, then uses the TrueWay Geocoding API to convert the address string into map coordinates {latitude, longitude}
let geoCode = async function(addressToConvert){
  
    //place a function here to parse address string and URL encode it (source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
    convertedQueryParamAddress = encodeURIComponent(addressToConvert);
    
    const fetchResultGeo = await fetch(`https://trueway-geocoding.p.rapidapi.com/Geocode?address=${convertedQueryParamAddress}&language=en`, {
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

    //return location coordinates as an object
    return data.results[0].location;
    })
    .catch(err => {
    console.error(err);
     });

    return fetchResultGeo;
}

//function that accepts an area code, state, city, search radius, and number of desired listings to return from Reality in US API
let searchListings = async function(areaCode, state, city, searchRadius, listingNumber){

    //place a function here to parse address string and URL encode it (source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
    queryStringCityName = encodeURIComponent(city);
    
    //note that we only have 500 API calls per month with this API (hard limit)
    const fetchResultList = await fetch(`https://realty-in-us.p.rapidapi.com/properties/list-for-rent?state_code=${state}&city=${queryStringCityName}&limit=${listingNumber}&offset=0&postal_code=${areaCode}&sort=relevance&radius=${searchRadius}`, {
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

    let listingsArray = data.listings

    //return the array of rental listings
    return listingsArray;
    
    })
    .catch(err => {
	console.error(err);
    });

    return fetchResultList;
}

module.exports = {
    distanceMatrix,
    geoCode,
    searchListings
}