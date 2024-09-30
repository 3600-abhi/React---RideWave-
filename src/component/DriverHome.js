import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useState, useEffect, forwardRef } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { updateUserInfo } from "../store/slice/user-slice";
import { Enums } from "../utils";
import { BookingApi } from "../apis";
import { Loader } from "../component";
import { ServerConfig } from "../config";
import { updateBookingInfo } from "../store/slice/booking-slice";
import { DriverNearByDriversOnMap } from "../component";



const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function DriverHome() {

    const userInfo = useSelector(store => store.user.userInfo);
    const bookingInfo = useSelector(store => store.booking.bookingInfo);

    const dispatch = useDispatch();

    const [stompClient, setStompClient] = useState(null);
    const [rideInfo, setRideInfo] = useState({});
    const [open, setOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [driverCoord, setDriverCoord] = useState({
        latitude: "",
        longitude: ""
    });



    useEffect(() => {
        const driverData = JSON.parse(localStorage.getItem(Enums.USER_TYPE.DRIVER));
        dispatch(updateUserInfo(driverData));
    }, []);



    useEffect(() => {

        const socket = new SockJS(ServerConfig.SOCKET_SERVICE_URI);
        const stomp = Stomp.over(socket);

        stomp.connect({}, () => {
            console.log("Connected to the WebSocket server");

            const driverData = JSON.parse(localStorage.getItem(Enums.USER_TYPE.DRIVER));

            stomp.subscribe(`/topic/rideRequest/${driverData.userId}`, (rideRequest) => {

                console.log("rideRequestFromSocket ::: ", rideRequest.body);

                dispatch(updateBookingInfo(rideRequest.body));

                setOpen(true);
            });
        });

        setStompClient(stomp);

        return () => {
            if (stompClient) stompClient.disconnect();
        };

    }, []);


    const handleAcceptBooking = () => {

        setOpen(false);

        const bookingInfoJson = JSON.parse(bookingInfo);

        const obj = {
            passengerId: bookingInfoJson.passengerId,
            driverId: bookingInfoJson.driverId,
            bookingId: bookingInfoJson.bookingId
        };

        stompClient.send("/app/rideResponse", {}, JSON.stringify(obj));
    };



    return (
        <div>

            {showLoader && (<Loader />)}

            <h1>Wait for Ride Request ...</h1>

            <DriverNearByDriversOnMap />


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ride Request from Abhi"}</DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You have recieved the Ride Request
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Deny</Button>
                    <Button onClick={handleAcceptBooking}>Accept</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default DriverHome;