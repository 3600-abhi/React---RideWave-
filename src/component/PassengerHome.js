import { StatusCodes } from "http-status-codes";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { LocationApi, BookingApi } from "../apis";
import { BookingIntiatedAlert, PassengerDriverMap } from "../component";
import { Enums } from "../utils";
import { updateUserInfo } from "../store/slice/user-slice";
import { updateBookingInfo } from "../store/slice/booking-slice";




function PassengerHome() {

    const dispatch = useDispatch();
    const userInfo = useSelector(store => store.user.userInfo);
    const bookingInfo = useSelector(store => store.booking.bookingInfo);
    const [stompClient, setStompClient] = useState(null);

    const [fromLocation, setFromLocation] = useState({
        location: "",
        latitude: "",
        longitude: "",
        invokeApi: true
    });

    const [toLocation, setToLocation] = useState({
        location: "",
        latitude: "",
        longitude: "",
        invokeApi: true
    });

    const [passengerCoord, setPassengerCoord] = useState({
        latitude: "",
        longitude: ""
    });

    const [suggestedFromLocationList, setSuggestedFromLocationList] = useState([]);
    const [suggestedToLocationList, setSuggestedToLocationList] = useState([]);

    useEffect(() => {
        const passengerData = JSON.parse(localStorage.getItem(Enums.USER_TYPE.PASSENGER));
        dispatch(updateUserInfo(passengerData));
    }, []);



    // for getting passenger latitude and longitude to give better auto suggestion
    useEffect(() => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("latitude ", latitude);
                console.log("longitude ", longitude);

                setPassengerCoord({
                    latitude: latitude,
                    longitude: longitude
                });
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);




    useEffect(() => {

        if (fromLocation.location === "" || !fromLocation.invokeApi) return;

        let timer;

        timer = setTimeout(() => {
            LocationApi.getLocationSuggestion({
                location: fromLocation.location,
                latitude: passengerCoord.latitude,
                longitude: passengerCoord.longitude
            }).then((data) => setSuggestedFromLocationList(data.data.suggestedLocationList));

        }, 1000);

        return () => clearTimeout(timer);

    }, [fromLocation]);



    useEffect(() => {

        if (toLocation.location === "" || !toLocation.invokeApi) return;

        let timer;

        timer = setTimeout(() => {
            LocationApi.getLocationSuggestion({
                location: toLocation.location,
                latitude: passengerCoord.latitude,
                longitude: passengerCoord.longitude
            }).then((data) => setSuggestedToLocationList(data.data.suggestedLocationList));

        }, 1000);

        return () => clearTimeout(timer);

    }, [toLocation]);


    const handleClickRideBooking = async () => {
        try {

            const bookingResponse = await BookingApi.createBooking({
                passengerId: userInfo.userId,
                fromLocation: fromLocation,
                toLocation: toLocation
            });

            if (bookingResponse.status === StatusCodes.CREATED) {
                console.log("inside booking if");
                dispatch(updateBookingInfo({
                    ...bookingInfo,
                    showBookingInitiatedAlert: true
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };





    return (
        <div>

            {bookingInfo.showBookingInitiatedAlert && (<BookingIntiatedAlert />)}


            <h1 className="font-bold text-2xl m-5">Book Ride</h1>

            <div className="flex m-5">

                <div className="">

                    <Autocomplete
                        className="m-5"
                        disablePortal
                        freeSolo
                        options={suggestedFromLocationList}
                        getOptionLabel={option => option.address}
                        onChange={(event, newVal) => {
                            setFromLocation({
                                location: newVal.address,
                                latitude: newVal.latitude,
                                longitude: newVal.longitude,
                                invokeApi: false
                            });
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="From Location"
                                onChange={(event) => {
                                    setFromLocation({
                                        ...fromLocation,
                                        location: event.target.value,
                                        invokeApi: true
                                    });
                                }}
                            />
                        )}
                    />


                    <Autocomplete
                        className="m-5"
                        disablePortal
                        freeSolo
                        options={suggestedToLocationList}
                        getOptionLabel={option => option.address}
                        onChange={(event, newVal) => {

                            setToLocation({
                                location: newVal.address,
                                latitude: newVal.latitude,
                                longitude: newVal.longitude,
                                invokeApi: false
                            });
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="To Location"
                                onChange={(event) => {
                                    setToLocation({
                                        ...toLocation,
                                        location: event.target.value,
                                        invokeApi: true
                                    });
                                }}
                            />
                        )}
                    />

                    <Button
                        className="ml-10"
                        variant="contained"
                        onClick={handleClickRideBooking}>
                        Book Ride
                    </Button>



                </div>

                <div className="w-full">
                    <PassengerDriverMap />
                </div>

            </div>
        </div>
    );
}

export default PassengerHome;