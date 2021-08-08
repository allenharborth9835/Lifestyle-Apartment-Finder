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
    workCity: null,
    workState: null,
    radius: null,
    apartmentAddress: null,
    apartmentAmount: null,
    gasCost: 0,
    workLat: 0,
    workLng: 0,
    chosenAptLat: 0,
    chosenAptLng: 0,
    mpg: null,
    averagePrice: null,
    commuteDistance: 0,
    commuteTime: 0
}

//css frame work javascript 
//DO NOT TOUCH!!!!!
$(document).ready(function () {
    $('.modal').modal();
});

//searches for local storage data
savedData = localStorage.getItem("budgetTracker");
if(!(savedData===null)){
    savedData = JSON.parse(savedData);
    budgetTracker = savedData;
    if(!(savedData.workAddress===null)){
        console.log(budgetTracker.workAddress, budgetTracker.radius);
        $("#apartment-search").html(`<p>searching for apartments within ${budgetTracker.radius} of ${budgetTracker.workAddress}<p>`);
        apartmentSearch();
    }
    if(!(savedData.apartmentAddress===null)){
        console.log(budgetTracker.apartmentAddress, budgetTracker.apartmentAmount);
        $("#apartment-pick").html(`<p>you choose ${budgetTracker.apartmentAddress} at ${budgetTracker.apartmentAmount}$<p>`);
    }
    if(!(savedData.mpg===null)){
        //gasCost = ((((budgetTracker.radius/budgetTracker.mpg) * budgetTracker.averagePrice)*2)*22);
        console.log(budgetTracker.mpg, budgetTracker.averagePrice, budgetTracker.gasCost);
        $("#gas-bill").html(`<p>the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
        $("#total-cost").html(`<p>the average total price of apartment and gas could be as high as ${parseInt(budgetTracker.apartmentAmount) + parseInt(budgetTracker.gasCost)}$ a month<p>`);
    }
}

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

//distance matrix function that accepts two sets of coordinates {latitude, longitude}, then utilizes TrueWay Matrix API to compute distances (in meters) and travel duration times between those two locations (assuming user is driving a car)
function distanceMatrix(budgetTracker){

    const meterToMile = 1609.34;
     
    fetch(`https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${budgetTracker.workLat}%2C${budgetTracker.workLng}&destinations=${budgetTracker.chosenAptLat}%2C${budgetTracker.chosenAptLng}`, {
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
        budgetTracker.commuteDistance = data.distances[0][0];
        budgetTracker.commuteTime = data.durations[0][0];
        console.log("The user commute distance(miles) is: " + Math.round((userGeoData.commuteDistance / meterToMile)));
        console.log("The user commute time(minutes) is: " + Math.round(userGeoData.commuteTime / 60 ));
    })
    .catch(err => {
	console.error(err);
    });
}

//function that accepts an address string, then uses the TrueWay Geocoding API to convert the address string into map coordinates {latitude, longitude}
function geoCode(addressToConvert){

    //place a function here to parse address string and convert it to query format
    convertedQueryParamAddress = addressToFetchQueryParam(addressToConvert);

    fetch(`https://trueway-geocoding.p.rapidapi.com/Geocode?address=${convertedQueryParamAddress}&language=en`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914",
		"x-rapidapi-host": "trueway-geocoding.p.rapidapi.com"
	    }
    })

    //add in loading txt into the html element

    .then(function(response){
	return response.json();
    })
    .then(function(data){
    console.log(data);
    console.log(data.results[0].location);

    })
    .catch(err => {
	console.error(err);
    });
}

function apartmentSearch(){
    for(let i = 0; i<50;i++){
        $("#apartment-listings").append(`${i+1}. apartment at  cost  <br>`);
    }
}

//function that handles work address input
function workHandler(){
    $("#apartment-search").append('');
    if($("#job-street-address").val() === ""||$("#job-city").val()==""){
        alert("must put in work address");
        return;
    }
    budgetTracker.workStreetAddress = $("#job-street-address").val();
    budgetTracker.workCity = $("#job-city").val();
    budgetTracker.workState = $("#job-state").val();
    budgetTracker.workAddress = `${budgetTracker.workStreetAddress} ${budgetTracker.workCity}, ${budgetTracker.workState}`;
    budgetTracker.radius = $("#radius").val();
    
    localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    console.log(budgetTracker.workAddress, budgetTracker.radius);
    $("#apartment-search").html(`<p>searching for apartments within ${budgetTracker.radius} of ${budgetTracker.workAddress}<p>`);
    if(!(budgetTracker.mpg===null)){
        budgetTracker.gasCost = ((((budgetTracker.radius/budgetTracker.mpg) * budgetTracker.averagePrice)*2)*22);

        $("#gas-bill").html(`<p>the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
        $("#total-cost").html(`<p>the average total price of apartment and gas could be as high as ${parseInt(budgetTracker.apartmentAmount) + parseInt(budgetTracker.gasCost)}$ a month<p>`);
    }
    apartmentSearch();
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
    budgetTracker.mpg = $("#MPG").val();
    budgetTracker.averagePrice = $("#gas-price").val();
    budgetTracker.gasCost = ((((budgetTracker.radius/budgetTracker.mpg) * budgetTracker.averagePrice)*2)*22);

    localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    $("#gas-bill").html(`<p>the maximum you'll pay for gas is ${parseInt(budgetTracker.gasCost)}$ a month<p>`);
    $("#total-cost").html(`<p>the average total price of apartment and gas could be as high as ${parseInt(budgetTracker.apartmentAmount) + parseInt(budgetTracker.gasCost)}$ a month<p>`);
    return;
}


$("#work-input-btn").on("click", workHandler);
$("#apartment-input-btn").on("click", apartmentHandler);
$("#gas-input-btn").on("click", gasCostHandler);
