/*-------------Test Data--------------------------------------------------------------------------------*/
//example location coordinate pairs:
//target work location coordinate pair: 40.74334317912754, -74.00767199382838
//example work address:  85 10th Ave, New York, NY 10011

//target Apt address coordinate pair: 41.30731428096317, -72.93124268296455
//example Apt address: 274 Crown St, New Haven, CT 06511

//fetch-query string conversion notes (see addressToFetchQueryParam() for implementation):
//274%20Crown%20St%2C%20New%20Haven%2C%20CT%2006511 (expected from rapid api "code snippet")
//274%20Crown%20St%2C%20New%20Haven%2C%20CT%2006511 (addressToFetchParama: result)
//274  %20   Crown  %20  St  %2C%20  New  %20  Haven  %2C%20  CT  %20   06511 (query interpretation)
// %20 = space
// %2C = ","
/*------------------------------------------------------------------------------------------------------*/

//Test user data object (work latitude/longitude; area code; city; state; address string, chosen apartment latitude/longitude, user provided commute radius, calculated commute distance/time)
const userData = {
    workAreaCode: 10011,
    workCity: "New York",
    workState: "NY",
    workAddress: "85 10th Ave, New York, NY 10011",
    workLat: 40.74334317912754,
    workLng: -74.00767199382838,
    aptAreaCode: 06511,
    aptCity: "New Haven",
    aptState: "CT",
    aptLat: 41.30731428096317,
    aptLng: -72.93124268296455,
    aptAddress: "274 Crown St, New Haven, CT 06511",
    commuteRadius: 20
}

//convert an address srting to a fetch query parameter for geoCode()
function addressToFetchQueryParam(addressString){
    // use String.prototype.replace() method

    //note that there is a need for address input validation, and that can be handled here or in the [framework-logic]

    const newaddressString1 = addressString.replace(/,/g,'%2C');

    const newaddressString2 = newaddressString1.replace(/\s/g,'%20');

    return newaddressString2;

}

//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations (assuming user is driving a car)
async function distanceMatrix(userDataObj){

    //conversion factor = # of meters/mile
    const meterToMile = 1609.34;

    const fetchResultMatrix = await fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${userDataObj.workLat}%2C${userDataObj.workLng}&destinations=${userDataObj.aptLat}%2C${userDataObj.aptLng}`, {
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
async function geoCode(addressToConvert){
  
    //place a function here to parse address string and convert it to query format
    convertedQueryParamAddress = addressToFetchQueryParam(addressToConvert);
    
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

//function that accepts an area code, state, city, search radius, and number of desired listings to return from Reality in us API
async function searchListings(userDataObj){

    //convert city name into a fetch query string
    queryStringCityName = addressToFetchQueryParam(userDataObj.workCity);

    const searchResponseLimit = 200;
    
    //note that we only have 500 API calls per month with this API (hard limit)
    const fetchResultList = await fetch(`https://realty-in-us.p.rapidapi.com/properties/list-for-rent?state_code=${userDataObj.workState}&city=${queryStringCityName}&limit=${searchResponseLimit}&offset=0&postal_code=${userDataObj.workAreaCode}&sort=relevance&radius=${userDataObj.commuteRadius}`, {
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

