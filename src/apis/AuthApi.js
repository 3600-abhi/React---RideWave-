import axios from "axios";
import { ServerConfig } from "../config";


async function passengerSignIn(data) {
    try {

        const body = {
            email: data.email,
            password: data.password
        };

        console.log("passengerSignInRequest ::: ", body);

        const response = await axios.post(ServerConfig.AUTH_SERVICE_URI + "/api/v1/auth/passengerSignIn", body);

        console.log("passengerSignInResponse ::: ", response.data);

        return response;
    } catch (error) {
        throw error;
    }
}


async function driverSignIn(data) {
    try {

        const body = {
            email: data.email,
            password: data.password
        };

        const response = await axios.post(ServerConfig.AUTH_SERVICE_URI + "/api/v1/auth/driverSignIn", body);

        return response;
    } catch (error) {
        throw error;
    }
}

export default {
    passengerSignIn,
    driverSignIn
};