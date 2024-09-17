import axios from "axios";
import { ServerConfig } from "../config";


async function signIn(email, password) {
    try {
        const body = { email, password };

        const response = await axios.post(ServerConfig.AUTH_SERVICE_URI + "/api/v1/auth/passengerSignIn", body);

        return response;
    } catch (error) {
        throw error;
    }
}

export default {
    signIn
};