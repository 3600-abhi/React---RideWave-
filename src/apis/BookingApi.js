import axios from "axios";
import { ServerConfig } from "../config";


async function createBooking(data) {
    try {

        const body = {
            passengerId: data.passengerId,
            startLocation: {
                latitude: data.fromLocation.latitude,
                longitude: data.fromLocation.longitude,
                placeName: data.fromLocation.location
            },
            endLocation: {
                latitude: data.toLocation.latitude,
                longitude: data.toLocation.longitude,
                placeName: data.fromLocation.location
            }
        };

        console.log("createBookingRequest ::: ", body);

        const response = await axios.post(ServerConfig.BOOKING_SERVICE_URI + "/api/v1/booking/createBooking", body);

        console.log("createBookingResponse ::: ", response.data);

        return response;
    } catch (error) {
        throw error;
    }
}


async function updateBooking(data) {
    try {

        const body = {
            passengerId: data.passengerId,
            startLocation: {
                latitude: data.fromLocation.latitude,
                longitude: data.fromLocation.longitude,
                placeName: data.fromLocation.location
            },
            "endLocation": {
                latitude: data.toLocation.latitude,
                longitude: data.toLocation.longitude,
                placeName: data.fromLocation.location
            }
        };

        console.log("updateBookingRequest ::: ", body);

        const response = await axios.post(ServerConfig.BOOKING_SERVICE_URI + "/api/v1/booking/createBooking", body);

        console.log("updateBookingResponse ::: ", response.data);

        return response;
    } catch (error) {
        throw error;
    }
}

export default {
    createBooking,
    updateBooking
};
