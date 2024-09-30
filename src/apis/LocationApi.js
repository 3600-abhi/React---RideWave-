import axios from "axios";
import { ServerConfig } from "../config";


async function getLocationSuggestion(data) {
    try {

        const body = {
            latitude: data.latitude,
            longitude: data.longitude,
            location: data.location
        };

        console.log("getLocationSuggestionRequest :: ", body);

        const response = await axios.post(ServerConfig.LOCATION_SERVICE_URI + "/api/v1/location/getLocationSuggestion", body);

        console.log("getLocationSuggestionResponse :: ", response.data);

        return response;
    } catch (error) {
        throw error;
    }
}


async function getNearByDriverList(data) {
    try {

        const nearbyDriverRequest = {
            latitude: data.latitude,
            longitude: data.longitude
        };

        console.log("nearbyDriverRequest :: ", nearbyDriverRequest);

        const response = await axios.post(ServerConfig.LOCATION_SERVICE_URI + "/api/v1/location/getNearbyDrivers", nearbyDriverRequest);

        console.log("getNearbyDriverListResponse :: ", response.data);

        //excluding the coordinate of itself....
        const nearByDriversResponseList = response.data.filter(location => !(location.latitude === data.latitude && location.longitude === data.longitude));

        response.data = nearByDriversResponseList;

        return response;
    } catch (error) {
        throw error;
    }
}



export default {
    getLocationSuggestion,
    getNearByDriverList
};