import { StatusCodes } from "http-status-codes";
import { TextField, Button } from '@mui/material';
import Card from '@mui/material/Card';
import { useState } from 'react';
import { Loader } from ".";
import { AuthApi } from "../apis";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from "../store/slice/user-slice";
import { Enums } from "../utils";

function PassengerSignIn() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        try {

            setLoading(true);
            const response = await AuthApi.passengerSignIn({ email, password });

            if (response.status === StatusCodes.OK) {
                localStorage.setItem(Enums.USER_TYPE.PASSENGER, JSON.stringify(response.data));
                dispatch(updateUserInfo(response.data));
                navigate(Enums.ROUTES.PASSENGER_HOME);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full bg-slate-100 flex justify-center items-center">
            <Card className="p-10 bg-red-600">
                <div className="flex flex-col justify-center items-center content-between space-y-4 h-full">

                    <h1 className="font-semibold text-4xl p-10">Login for Passenger</h1>


                    <TextField
                        className="w-full"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />


                    <TextField
                        className="w-full"
                        id="outlined-basic"
                        type="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <Button variant="contained" onClick={() => handleSignIn()}>
                        Sign In
                    </Button>

                </div>
            </Card>

            {loading && <Loader />}


        </div>
    );
}

export default PassengerSignIn;