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



const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function DriverHome() {

    const userInfo = useSelector(store => store.user.userInfo);
    const dispatch = useDispatch();
    const [stompClient, setStompClient] = useState(null);
    const [rideInfo, setRideInfo] = useState({});
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const driverData = JSON.parse(localStorage.getItem(Enums.USER_TYPE.DRIVER));
        dispatch(updateUserInfo(driverData));
    }, []);



    useEffect(() => {

        const socket = new SockJS("http://localhost:8080/ws");
        const stomp = Stomp.over(socket);

        stomp.connect({}, () => {
            console.log("Connected to the WebSocket server");

            const driverData = JSON.parse(localStorage.getItem(Enums.USER_TYPE.DRIVER));

            stomp.subscribe(`/topic/rideRequest/${driverData.userId}`, (rideRequest) => {
                console.log("Received message from server", rideRequest);
                setRideInfo(rideRequest);
                setOpen(true);
            });
        });

        setStompClient(stomp);

        return () => {
            if (stompClient) stompClient.disconnect();
        };

    }, []);




    return (
        <div>
            <h1>Welcome to Driver Home Page</h1>

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
                    <Button onClick={() => setOpen(false)}>Accept</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default DriverHome;