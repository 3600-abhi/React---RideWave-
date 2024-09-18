import { useSelector } from "react-redux";


function PassengerHome() {

    const userInfo = useSelector(store => store.user.userInfo);

    return (
        <div>
            <h1>Welcome to Passenger</h1>
            <h2>name : {userInfo.name}</h2>
        </div>
    );
}

export default PassengerHome;