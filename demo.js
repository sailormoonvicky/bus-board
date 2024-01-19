import fetch from 'node-fetch';
import promptSync from 'prompt-sync';

const prompt = promptSync();

async function getNextBuses(){
    const stopCode = await getStopCode();
    getBuses(stopCode);
}

async function getStopCode(){
    try {
    const stopCode = prompt('Please enter your stop code: ');
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopCode}`);
    console.log(response.status);
    if (!response.ok)
{
    throw `Stop id API response error ${response.status}`;
}    // const stopCode = "490008660N";
    return stopCode;
} catch(error) {
    console.log(error);
    throw error;
}
}

async function getBuses(stopCode){
    const API_URL = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`;
    console.log(API_URL);

    try {
        const response = await fetch(API_URL);
        const allBuses = await response.json();
        if (!response.ok) {
            throw `Bus arrivals API response error: ${response.status}`;
        }
        console.log(`Response code: ${response.status}`);
        // console.log(allBuses.length);
        const buses = allBuses.sort((a,b) => a.timeToStation - b.timeToStation);   

        // const route = buses[0].lineId;
        // const destination = buses[0].destinationName;
        // const arrivalTime = Math.floor(buses[0].timeToStation / 60);
        // console.log(`Your next bus will be the ${route} to ${destination}. Arriving in ${arrivalTime} minutes.`);
    
        console.log("Your next five buses are:");
            for (let i= 0; i < 5; i++){
            const route = buses[i].lineId;
            const destination = buses[i].destinationName;
            const arrivalTime = Math.floor(buses[i].timeToStation / 60);
            console.log(`Your next bus will be the ${route} to ${destination}. Arriving in ${arrivalTime} minutes.`);
            }

    } catch (error) {
        console.log(error);
        throw error;
    }

}

getNextBuses();