import { TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import { useState } from 'react';
import { Loader } from "../component";
import { AuthApi } from "../apis";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from "../store/slice/user-slice";

function Signin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const response = await AuthApi.signIn(email, password);

            if (response.status === 200) {
                dispatch(updateUserInfo(response.data));
                navigate("/booking");
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

export default Signin;