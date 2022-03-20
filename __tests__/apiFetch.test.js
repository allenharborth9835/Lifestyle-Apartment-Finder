const { distanceMatrix,
        geoCode,
        searchListings } = require("../assets/js/script.js");

//faux user data simulating input from the application form
const testData = {
    //simulating the user's work address
    origin: {
        lat: 40.74334317912754,
        lng: -74.00767199382838,
        areaCode: "10011",
        city: "New York",
        state: "NY",
        address: "85 10th Ave, New York, NY 10011",
    },
    //simulating a 'chosen' apartment
    destination: {
        lat: 41.30731428096317,
        lng: -72.93124268296455,
        areaCode: "06511",
        city: "New Haven",
        state: "CT",
        address: "274 Crown St, New Haven, CT 06511"
    },
    searchParams: {
        searchRadius: 20,
        responseLimit: 15
    }
}

//testing function 'distanceMatrix': expect an object containing the commute distance and commute time
test('calculate commute distance and time between two coordinates in miles/minutes respectively', async() => {
    let commute = await distanceMatrix(testData.origin, testData.destination);

    expect(commute.commuteDistance).toEqual(expect.any(Number));
    expect(commute.commuteTime).toEqual(expect.any(Number));
});

//testing function 'geoCode': expect a single coordinate pair returned from function
test('convert address string to location coordinates', async() => {
    let workCoordinates = await geoCode(testData.origin.address);

    expect(workCoordinates.lat).toEqual(expect.any(Number));
    expect(workCoordinates.lng).toEqual(expect.any(Number));
});

//testing function 'searchListings': expect an array of apartment listings equaling the length of the response request limit to the API
test('collect apartment listings from API endpoint', async() => {
    let listings = await searchListings(testData.origin.areaCode, testData.origin.state, testData.origin.city, testData.searchParams.searchRadius, testData.searchParams.responseLimit)

    expect(listings.length).toBe(testData.searchParams.responseLimit)
});