import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { LocationApi } from "../apis";


function PassengerHome() {

    const userInfo = useSelector(store => store.user.userInfo);

    const [stompClient, setStompClient] = useState(null);

    const [invokeLocAutoSuggApi, setInvokeLocAutoSuggApi] = useState(true);

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



    // for managing websocket
    // useEffect(() => {

    //     const socket = new SockJS("http://localhost:8080/ws");
    //     const stomp = Stomp.over(socket);

    //     stomp.connect({}, () => {
    //         console.log("Connected to the WebSocket server");

    //         stomp.subscribe("/topic/ping", (message) => {
    //             console.log("Received message from server", message);
    //             setMessages((prevMessages) => [...prevMessages, message.body]);
    //         });
    //     });

    //     setStompClient(stomp);

    //     return () => {
    //         if (stompClient) stompClient.disconnect();
    //     };

    // }, []);


    // const handleSubmit = () => {
    //     console.log("inside handleSubmit");
    //     if (stompClient && inputValue) {
    //         stompClient.send("/app/ping", {}, JSON.stringify({ data: inputValue }));
    //         setInputValue("");
    //     }
    // };


    useEffect(() => {

        if (fromLocation.location === "" || !fromLocation.invokeApi) return;

        let timer;

        timer = setTimeout(() => {
            console.log("fromLocation.location = ", fromLocation.location);

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
            console.log("toLocation.location = ", toLocation.location);

            LocationApi.getLocationSuggestion({
                location: toLocation.location,
                latitude: passengerCoord.latitude,
                longitude: passengerCoord.longitude
            }).then((data) => setSuggestedToLocationList(data.data.suggestedLocationList));

        }, 1000);

        return () => clearTimeout(timer);

    }, [toLocation]);





    return (
        <div>

            <h1 className="font-bold text-2xl m-5">Booking</h1>

            <div className="flex m-5">

                <div className="">

                    <Autocomplete
                        className="m-5"
                        disablePortal
                        freeSolo
                        options={suggestedFromLocationList}
                        getOptionLabel={option => option.address}
                        onChange={(event, newVal) => {

                            setInvokeLocAutoSuggApi(false);

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
                                label="From"
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
                                label="To"
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



                </div>

                <div>
                    Hi
                </div>

            </div>
        </div>
    );
}

export default PassengerHome;