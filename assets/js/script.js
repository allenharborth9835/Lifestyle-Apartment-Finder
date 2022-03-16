/*--------------------------------------------[api-logic] Pseudocode/input and output/functional structure------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
    3) searchListings(areaCode, stateCode, city, searchRadius)
    4) addressToFetchQueryParam()

    API(s):
    1) TrueWay Matrix API
    2) TrueWay Geocoding API (geocoding)
    3) Reality in US API (apartment listings)

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
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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

/*----------------Uncommment to Test APIs------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// async distanceMatrix(() example

/*
distanceMatrix(userData).then(function(data){
    var divEl = document.querySelector("#target");
    var newParahEl = document.createElement("p");
    newParahEl.innerHTML = "The user commute distance between work and home is " + data.commuteDistance + " miles" + ", with a estimated travel time of " + Math.round(data.commuteTime/60) + " hr " + Math.round(((data.commuteTime % 60)/60) * 60) + " min";
    divEl.appendChild(newParahEl);
});
*/

//async geoCode() example

/*
geoCode(userData.aptAddress).then(function(data){
    var divEl = document.querySelector("#target");
    var newParahEl = document.createElement("p");
    newParahEl.innerHTML = "The apartment address (" + userData.aptAddress + ")"+ " latitude/longitude pair is: " + data.lat + "/" + data.lng;
    divEl.appendChild(newParahEl);
});
*/

// async searchListings() example:

/*
searchListings(userData).then(function(data){
    var divEl = document.querySelector("#target");
    var orderedListEL = document.createElement("ol");
    divEl.appendChild(orderedListEL);

    for(let i = 0; i < data.length; i++ ){
        var orderedListItem = document.createElement("li");
        if(data[i].photo_count > 0){
            orderedListItem.innerHTML = "<h1>" + data[i].address + "<h1><br>" + "<h2>" + data[i].lat + "/" + data[i].lon + "<h2><br>" + "<img src='" 
            + data[i].photo + "'style='width:autopx;height:autopx;'>" + "<h3>" + data[i].sqft + ", Beds: " + data[i].beds + ", Baths: " + data[i].baths 
            + " Monthly Rent:" + data[i].price + "," + data[i].price_raw + "<h3><br>";
        } else{
            orderedListItem.innerHTML = "<h1>" + data[i].address + data[i].lat + "/" + data[i].lon + "<h1><br>" + "<img src='" 
            + "<h2>No Photo to Display<h2>" + "'>" + "<h3>" +  data[i].sqft + ", Beds: " + data[i].beds + ", Baths: " + data[i].baths 
            + " Monthly Rent:" + data[i].price + "," + data[i].price_raw + "<h3><br>";
        }
        orderedListEL.appendChild(orderedListItem);
    }
});
*/

// convert address string to fetch query string example:

//addressToFetchQueryParam(addressExample);

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/





