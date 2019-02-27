
const axios = require('axios');

module.exports = async function getMaxSpeead(lat, long) {
    console.log(long, lat);
    // first call to get the road id 

    let osm_id = undefined;
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`)
        osm_id = response.data.osm_id;
        console.log(response.data, "ID");
        if (osm_id) {
            console.log(osm_id, "id from inside");
            // another request to get max speed limit based on street id
            try {
                const response = await axios.get(`http://overpass-api.de/api/interpreter?data=[out:json];way(${osm_id});out;`)
                const data = response.data;

                // look for the max speed tag on the elements we got 
                if (data.elements > 0 && data.elements[0].tags.maxspeed) {
                    console.log(data.elements[0].tags.maxspeed, "hey");
                    return data.elements[0].tags.maxspeed;
                } else {
                    return undefined;
                }
            }
            catch (err) {
                console.log(err);
                return undefined;

            }
        } else {
            console.log('couldn\'t find speed limit for this coordinations ');
            return undefined;
        }
    }
    catch (err) {
        console.log(err);
        return undefined;

    }
}