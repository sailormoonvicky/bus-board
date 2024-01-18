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

    // const arrivalBuses = [];
    if (sortedData.length >= 5) {
        for (let i = 0; i < 5; i++) {
            let bus = sortedData[i];
            console.log(`The bus ${bus.lineName} towards ${bus.towards} will come at the station ${bus.stationName} in ${Math.floor(bus.timeToStation/60)} mins, the destination is ${bus.destinationName}. `);
            // arrivalBuses.push([bus[lineName], bus[towards], bus[stationName], Math.floor(bus[timeToStation]/60), bus[destinationName]])
        }
    } else {
        sortedData.forEach(bus => {
            console.log(`The bus ${bus.lineName} towards ${bus.towards} will come at the station ${bus.stationName} in ${Math.floor(bus.timeToStation/60)} mins, the destination is ${bus.destinationName}. `);
        });
    }
}

busInfo('490008660N');


// Part 2
// Your aim is to build an application which, 
// given a postcode, finds the two nearest bus stops, 
// and shows the next five buses due at each.

