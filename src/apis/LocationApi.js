import axios from "axios";
import { ServerConfig } from "../config";


async function getLocationSuggestion(data) {
    try {

        const body = {
            latitude: data.latitude,
            longitude: data.longitude,
            location: data.location
        };

        const response = await axios.post(ServerConfig.LOCATION_SERVICE_URI + "/api/v1/location/getLocationSuggestion", body);

        console.log("sggestedLocation = ", response.data);

        return response;
    } catch (error) {
        throw error;
    }
}



export default {
    getLocationSuggestion
};