const distanceMatrix = require("../assets/js/script.js");

const testData = {
    origin: {
        lat: 40.74334317912754,
        lng: -74.00767199382838
        // areaCode: 10011,
        // city: "New York",
        // state: "NY",
        // address: "85 10th Ave, New York, NY 10011",
    },
    destination: {
        lat: 41.30731428096317,
        lng: -72.93124268296455
        // areaCode: 06511,
        // city: "New Haven",
        // state: "CT",
        // address: "274 Crown St, New Haven, CT 06511"
    }
}

test('calculate commute distance between two coordinates in miles', async() => {
    let commute = await distanceMatrix(testData.origin, testData.destination);

    expect(commute.commuteDistance).toEqual(expect.any(Number));
    expect(commute.commuteTime).toEqual(expect.any(Number));
});

// test('convert address string to location coordinates', () => {

// });

// test('collect apartment listings from API endpoint', () => {

// });