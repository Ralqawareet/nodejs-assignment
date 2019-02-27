
const axios = require('axios');

module.exports = async function getMaxSpeead(lat, long) {
    const radius = 50; // meters
    // the quesy is as follow 
    // way ( radius , lat , long ) self explainatory 
    // [maxspeed] filters results for this tag
    let queryUrl = `http://overpass-api.de/api/interpreter?data=[out:json];way(around:${radius},${lat},${long})[maxspeed];out;`
    try {
        const response = await axios.get(queryUrl)
        const data = response.data;
        console.log(data, "data");

        // look for the max speed tag on the elements we got 
        if (data.elements.length > 0) {
            console.log(data.elements[0].tags.maxspeed, "Gotcha ");
            return data.elements[0].tags.maxspeed;
        } else {
            return null;
        }
    }
    catch (err) {
        console.log(err);
        return null;

    }
}
