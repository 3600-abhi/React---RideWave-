import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { updateBookingInfo } from "../store/slice/booking-slice";
import { useDispatch, useSelector } from "react-redux";
import { forwardRef } from "react";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function BookingIntiatedAlert() {

    const bookingInfo = useSelector(store => store.booking.bookingInfo);
    const dispatch = useDispatch();


    const handleBtnClick = () => {
        dispatch(updateBookingInfo({
            ...bookingInfo,
            showBookingInitiatedAlert: false
        }));

    };

    return (
        <div>
            <Dialog
                open={bookingInfo.showBookingInitiatedAlert}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    Booking Initiated Successfuly
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Booking Initiated, You will be informed once any driver accept your ride request
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleBtnClick}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BookingIntiatedAlert;