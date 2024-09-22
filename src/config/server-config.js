import dotenv from "dotenv";

dotenv.config();

export default {
    AUTH_SERVICE_URI: process.env.AUTH_SERVICE_URI,
    LOCATION_SERVICE_URI: process.env.LOCATION_SERVICE_URI
};