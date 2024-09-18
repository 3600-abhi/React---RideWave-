import { useSelector } from "react-redux";


function DriverHome() {

    const userInfo = useSelector(store => store.user.userInfo);

    return (
        <div>
            <h1>Welcome to Driver</h1>
            <h2>name : {userInfo.name}</h2>
        </div>
    );
}

export default DriverHome;