import fetch from 'node-fetch';

// Part 1
//  Your program should ask the user for a stop code, 
// and print a list of the next five buses at that stop code, 
// with their routes, destinations, 
// and the time until they arrive in minutes.

async function busInfo(id) {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`, {
        method: 'GET'});


    
    const data = await response.json();
    const sortedData = data.sort((a,b) => {
        return a.timeToStation - b.timeToStation;
    })

    if (sortedData.length >= 5) {
        for (let i = 0; i < 5; i++) {
            let bus = sortedData[i];
            console.log(`The bus ${bus.lineName} towards ${bus.towards} will come at the station ${bus.stationName} in ${Math.floor(bus.timeToStation/60)} mins, the destination is ${bus.destinationName}. `);
        }
    } else {
        sortedData.forEach(bus => {
            console.log(`The bus ${bus.lineName} towards ${bus.towards} will come at the station ${bus.stationName} in ${Math.floor(bus.timeToStation/60)} mins, the destination is ${bus.destinationName}. `);
        });
    }
}

// busInfo('490008660N');


// Part 2
// Your aim is to build an application which, 
// given a postcode, finds the two nearest bus stops, 
// and shows the next five buses due at each.

async function getBusStop (postcode) {
    try {
        const url = `https://api.postcodes.io/postcodes/${postcode}`;
        const response = await fetch(url, {method:'GET'});
        const data = await response.json();
        const lat = data.result.latitude;
        const lon = data.result.longitude;

        const tflURL = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}7&stopTypes=NaptanPublicBusCoachTram&radius=1000`;

        const tflResponse = await fetch (tflURL, {method: 'GET'});
        // console.log(tflResponse.status);
        const stops = await tflResponse.json();

        const result = new Array(2);
        result[0] = stops.stopPoints[0].naptanId;
        result[1] = stops.stopPoints[1].naptanId;
        // console.log(result);

        return result;

    } catch (error) {
        console.error (`Download error: ${error.message}`);
    }
}

// getBusStop('NW3 5RL');

async function postalBus (postcode) {

    try {
        const stopIds = await getBusStop(postcode);

        if (stopIds && stopIds >= 2) {
            console.log(`The info about the nearst bus station: `);
            await busInfo(stopIds[0]);
        
            console.log(`The info about the second nearst bus station: `);
            await busInfo(stopIds[1]);
        } else {
            console.log('Unable to find nearest bus stops.');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

}

postalBus('NW3 5RL');