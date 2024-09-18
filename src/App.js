import React from "react";
import ReactDOM from "react-dom/client";
import { Header, PassengerHome, PassengerSignIn, DriverSignIn, DriverHome } from "./component";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store/store";
import { Enums } from "./utils";


export default function App() {

    const { ROUTES } = Enums;

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path={ROUTES.HOME} element={<PassengerSignIn />} />
                    <Route path={ROUTES.DRIVER_SIGNIN} element={<DriverSignIn />} />
                    <Route path={ROUTES.PASSENGER_HOME} element={<PassengerHome />} />
                    <Route path={ROUTES.DRIVER_HOME} element={<DriverHome />} />

                </Routes>
            </BrowserRouter>
        </Provider>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);