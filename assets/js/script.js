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

//holds the user choice
let apartmentChoice = 0;

//object to store local storage
let budgetTracker = {
    workAddress: null,
    workStreetAddress: null,
    workAreaCode:null,
    workCity: null,
    workState: null,
    radius: null,
    apartmentAddress: null,
    apartmentAmount: null,
    gasCost: 0,
    workLat: null,
    workLng: null,
    AptLat: null,
    AptLng: null,
    mpg: null,
    averagePrice: null,
    commuteDistance: null,
    commuteTime: null,
    apartmentData:null
}

//css frame work javascript 
//DO NOT TOUCH!!!!!
$(document).ready(function () {
    $('.modal').modal();
});

//convert an address srting to a fetch query parameter for geoCode()
function addressToFetchQueryParam(addressString){
    // use String.prototype.replace() method
    //note that there is a need for address input validation, and that can be handled here or in the [framework-logic]

    console.log(addressString);
    const newaddressString1 = addressString.replace(/,/g,'%2C');

    console.log(newaddressString1);
    const newaddressString2 = newaddressString1.replace(/\s/g,'%20');

    console.log(newaddressString2);
    return newaddressString2;
}
//old
async function distanceMatrix(budgetTracker){

    //conversion factor = # of meters/mile
    const meterToMile = 1609.34;

    const fetchResultMatrix = await fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${budgetTracker.workLat}%2C${budgetTracker.workLng}&destinations=${budgetTracker.AptLat}%2C${budgetTracker.AptLng}`, {
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
        //for one location coordinate pair {lat, lng}, response is in the form of a 2D array ("distances" in meters or "durations" in seconds) with distance value at position [0][0]
        //let commuteObj = {};
        //commuteObj.commuteDistance = Math.round((data.distances[0][0])/ meterToMile);
        //commuteObj.commuteTime = Math.round((data.durations[0][0])/60);
        //console.log("The user commute distance(miles) is: " + commuteObj.commuteDistance);
        //console.log("The user commute time(minutes) is: " + commuteObj.commuteTime);
        budgetTracker.commuteDistance = (data.distances[0][0])/ meterToMile;
        budgetTracker.commuteTime = Math.round((data.durations[0][0])/60);
        console.log("The user commute distance(miles) is: " + budgetTracker.commuteDistance);
        console.log("The user commute time(minutes) is: " + budgetTracker.commuteTime);
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));

        //return commuteObj ={commuteDistance: X (miles, to nearest mile), commuteTime: Y (minutes, to nearest minute)}
        //return commuteObj;
    })
    .catch(err => {
	console.error(err);
    });
    
    console.log(budgetTracker);
    //return fetchResultMatrix;
}
/*
//new
//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations (assuming user is driving a car)
async function distanceMatrix(budgetTracker){

    const fetchResultMatrix = await fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${budgetTracker.workLat}%2C${budgetTracker.workLng}&destinations=${budgetTracker.aptLat}%2C${budgetTracker.aptLng}`, {
	"method": "GET",
	"headers": {
		'x-rapidapi-key': '7536dee8b5msh03cc5ee840cda5bp11f4bdjsna6622adb57df',
        'x-rapidapi-host': 'trueway-matrix.p.rapidapi.com'
	}
    })
    .then(function(response){
	    return response.json();
    })
    .then(function(data){
        console.log(data);

        //conversion factor = # of meters/mile
        const meterToMile = 1609.34;

        //for one location coordinate pair {lat, lng}, response is in the form of a 2D array ("distances" in meters or "durations" in seconds) with distance value at position [0][0]
        budgetTracker.commuteDistance = (data.distances[0][0])/ meterToMile + 1;
        budgetTracker.commuteTime = Math.round((data.durations[0][0])/60) + 1;
        console.log("The user commute distance(miles) is: " + budgetTracker.commuteDistance);
        console.log("The user commute time(minutes) is: " + budgetTracker.commuteTime);
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));

        return;
    })
    .catch(err => {
	    console.error(err);
    });
    
    console.log(fetchResultMatrix);
    return fetchResultMatrix;
}
*/


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
        console.log(data);
        //isolate location coordinates as an object
        console.log(data.results[0].location);
    
        //return location coordinates as an object
        return data.results[0].location;
    })
    .catch(err => {
	    console.error(err);
    });
    console.log(fetchResultGeo)
        return fetchResultGeo;

}

//function that accepts an area code, state, city, search radius, and number of desired listings to return from Reality in us API
async function searchListings(budgetTracker){

    console.log(budgetTracker.workCity);

    //convert city name into a fetch query string
    queryStringCityName = addressToFetchQueryParam(budgetTracker.workCity);

    console.log(queryStringCityName);

    const searchResponseLimit = 200;
    
    //note that we only have 500 API calls per month with this API (hard limit)
    const fetchResultList = await fetch(`https://realty-in-us.p.rapidapi.com/properties/list-for-rent?state_code=${budgetTracker.workState}&city=${queryStringCityName}&limit=${searchResponseLimit}&offset=0&postal_code=${budgetTracker.workAreaCode}&sort=relevance&radius=${budgetTracker.radius}`, {
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

    let listingsArray = data.listings

    //return the array of rental listings
    for(let i = 0; i < listingsArray.length; i++){
        if(listingsArray[i].price_raw === 0){
            console.log("Listing #: " + (i+1) + " requires " + "Phone " + listingsArray[i].price + " for price quote");
        }
    }

    console.log("We have returned " +data.listings.length + " potential listings according to the requested search parameters");
    return listingsArray;
    
    })
    .catch(err => {
	    console.error(err);
    });

    console.log(fetchResultList);
    return fetchResultList;
}


//function that handles work address input
function workHandler(){
    $("#apartment-search").append('');
    if($("#job-street-address").val() === ""||$("#job-city").val()==""){
        alert("must put in work address");
        return;
    }
    budgetTracker.workStreetAddress = $("#job-street-address").val();
    budgetTracker.workAreaCode = $("#job-area-code").val();
    budgetTracker.workCity = $("#job-city").val();
    budgetTracker.workState = $("#job-state").val();
    budgetTracker.workAddress = `${budgetTracker.workStreetAddress} ${budgetTracker.workCity}, ${budgetTracker.workState}`;
    budgetTracker.radius = $("#radius").val();

    geoCode(budgetTracker.workAddress).then(function(data){
        budgetTracker.workLat = data.lat;
        budgetTracker.workLng = data.lng;
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    });
    $("#apartment-search").html(`<p>searching for apartments within ${budgetTracker.radius} of ${budgetTracker.workAddress}<p>`);
    searchListings(budgetTracker).then(function(data){
        console.log(data);
        budgetTracker.apartmentData = data;
        var divEl = document.querySelector("#apartment-listings");
        var orderedListEL = document.createElement("ul");
        divEl.appendChild(orderedListEL);
        for(let i = 0; i < data.length; i++ ){
            var orderedListItem = document.createElement("li");
            if(data[i].photo_count > 0){
                orderedListItem.innerHTML = "<p>" + (i+1)+". " + data[i].address + "<p>" + "<p>" + data[i].lat + "/" + data[i].lon + "<p>" + "<img src='" 
                + data[i].photo + "'style='width:autopx;height:autopx;' width='900' height='600'>" + "<p>" + data[i].sqft + ", Beds: " + data[i].beds + ", Baths: " + data[i].baths 
                + " Monthly Rent:" + data[i].price + "," + data[i].price_raw + "<p>";
            } else{
                orderedListItem.innerHTML = "<p>" + data[i].address + data[i].lat + "/" + data[i].lon + "<p>" + "<img src='" 
                + "<p>No Photo to Display<p>" + "'>" + "<p>" +  data[i].sqft + ", Beds: " + data[i].beds + ", Baths: " + data[i].baths 
                + " Monthly Rent:" + data[i].price + "," + data[i].price_raw + "<p>";
            }
            orderedListEL.appendChild(orderedListItem);
        }
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    });
    if(!(budgetTracker.mpg===null)){
        budgetTracker.gasCost = ((((budgetTracker.radius/budgetTracker.mpg) * budgetTracker.averagePrice)*2)*22);

        $("#gas-bill").html(`<p>the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
        $("#total-cost").html(`<p>the average total price of apartment and gas could be as high as ${parseInt(budgetTracker.apartmentAmount) + parseInt(budgetTracker.gasCost)}$ a month<p>`);
    }
    return;
}

//function that handles apartment input
function apartmentHandler(){
    if($("#apartment-choice").val() === ""){
        alert("apartment needs to be chosen from the list of choices");
        return;
    }
    if(isNaN($("#apartment-choice").val())){
        alert("apartment choice must be a number");
        return;
    }
    apartmentChoice = $("#apartment-choice").val();

        budgetTracker.apartmentAddress = budgetTracker.apartmentData[apartmentChoice-1].address;
        budgetTracker.apartmentAmount = budgetTracker.apartmentData[apartmentChoice-1].price_raw;
        budgetTracker.AptLat = budgetTracker.apartmentData[apartmentChoice-1].lat;
        budgetTracker.AptLng = budgetTracker.apartmentData[apartmentChoice-1].lon;
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
        $("#apartment-pick").html(`<p>you choose ${budgetTracker.apartmentAddress} at ${budgetTracker.apartmentAmount}$<p>`);

    if(!(budgetTracker.mpg===null)){
        $("#total-cost").html(`<p>the average total price of apartment and gas could be as high as ${parseInt(budgetTracker.apartmentAmount) + parseInt(budgetTracker.gasCost)}$ a month<p>`);
    }
    return;
}
//funtion that handles gas bill input
function gasCostHandler(){
    if($("#MPG").val() === ""||$("#gas-price").val() === ""){
        alert("must put in MPG and gas-price");
        return;
    }
    if(isNaN($("#MPG").val()) || isNaN($("#gas-price").val())){
        alert("MPG and gas-price have to be numbers");
        return;
    }
    budgetTracker.mpg = Number($("#MPG").val());
    budgetTracker.averagePrice = Number($("#gas-price").val());

    distanceMatrix(budgetTracker).then(function(){

        budgetTracker.gasCost = (((budgetTracker.commuteDistance/budgetTracker.mpg) * budgetTracker.averagePrice)*2*22);

        console.log(budgetTracker);

        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
        $("#total-cost").html(`<p>your commute distance between work and home is ${budgetTracker.commuteDistance } miles, with a estimated travel time of ${Math.round(budgetTracker.commuteTime/60)} hours and ${Math.round(((budgetTracker.commuteTime % 60)/60) * 60) } min. the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
    });
}


//searches for local storage data
savedData = localStorage.getItem("budgetTracker");
if(!(savedData===null)){
    savedData = JSON.parse(savedData);
    budgetTracker = savedData;
    if(!(savedData.workAddress===null)){
        $("#apartment-search").html(`<p>searching for apartments within ${budgetTracker.radius} of ${budgetTracker.workAddress}<p>`);
        /*
        var divEl = document.querySelector("#apartment-listings");
        var orderedListEL = document.createElement("ul");
        divEl.appendChild(orderedListEL);
        for(let i = 0; i < budgetTracker.apartmentData.length; i++ ){
            var orderedListItem = document.createElement("li");
            if(budgetTracker.apartmentData[i].photo_count > 0){
                orderedListItem.innerHTML = "<p>" + (i+1)+". " + budgetTracker.apartmentData[i].address + "<p>" + "<p>" + budgetTracker.apartmentData[i].lat + "/" + budgetTracker.apartmentData[i].lon + "<p>" + "<img src='" 
                + budgetTracker.apartmentData[i].photo + "'style='width:autopx;height:autopx;' width='900' height='600'>" + "<p>" + budgetTracker.apartmentData[i].sqft + ", Beds: " + budgetTracker.apartmentData[i].beds + ", Baths: " + budgetTracker.apartmentData[i].baths 
                + " Monthly Rent:" + budgetTracker.apartmentData[i].price + "," + budgetTracker.apartmentData[i].price_raw + "<p>";
            } else{
                orderedListItem.innerHTML = "<p>" + budgetTracker.apartmentData[i].address + budgetTracker.apartmentData[i].lat + "/" + budgetTracker.apartmentData[i].lon + "<p>" + "<img src='" 
                + "<p>No Photo to Display<p>" + "'>" + "<p>" +  budgetTracker.apartmentData[i].sqft + ", Beds: " + budgetTracker.apartmentData[i].beds + ", Baths: " + budgetTracker.apartmentData[i].baths 
                + " Monthly Rent:" + budgetTracker.apartmentData[i].price + "," + budgetTracker.apartmentData[i].price_raw + "<p>";
            }
            orderedListEL.appendChild(orderedListItem);
        }
        */
        localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    }
    if(!(savedData.apartmentAddress===null)){
        $("#apartment-pick").html(`<p>you choose ${budgetTracker.apartmentAddress} at ${budgetTracker.apartmentAmount}$<p>`);
    }
    if(!(savedData.mpg===null)){
        $("#gas-bill").html(`<p>the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
        $("#total-cost").html(`<p>your commute distance between work and home is ${budgetTracker.commuteDistance } miles, with a estimated travel time of ${Math.round(budgetTracker.commuteTime/60)} hours and ${Math.round(((budgetTracker.commuteTime % 60)/60) * 60) } min. the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
    }
}


$("#work-input-btn").on("click", workHandler);
$("#apartment-input-btn").on("click", apartmentHandler);
$("#gas-input-btn").on("click", gasCostHandler);
