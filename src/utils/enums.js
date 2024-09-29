const USER_TYPE = {
    PASSENGER: "PASSENGER",
    DRIVER: "DRIVER"
};


const ROUTES = {
    HOME: "/",
    PASSENGER_HOME: "/passengerHome",
    DRIVER_HOME: "/driverHome",
    DRIVER_SIGNIN: "/driverSignIn",
    PASSENGER_HOME: "/passengerHome",
    PASSENGER_SIGNIN: "/passengerSignIn",
    ABOUT: "/about"
};

const BOOKING_STATUS = {
    SCHEDULED: "SCHEDULED",
    CANCELLED: "CANCELLED",
    CAB_ARRIVED: "CAB_ARRIVED",
    ASSIGNING_DRIVER: "ASSIGNING_DRIVER",
    IN_RIDE: "IN_RIDE",
    COMPLETED: "COMPLETED"
};


export default {
    USER_TYPE,
    ROUTES,
    BOOKING_STATUS
};