import { useSelector } from "react-redux";


function Booking() {

    const userInfo = useSelector(store => store.user.userInfo);

    return (
        <div>
            <h1>Booking</h1>
            <h2>name : {userInfo.name}</h2>
        </div>
    );
}

export default Booking;