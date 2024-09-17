import React from "react";
import ReactDOM from "react-dom/client";
import { Signin, Booking } from "./component";
import { Provider } from "react-redux";
import { Outlet, RouterProvider } from "react-router-dom";
import appRouter from "./routes/app-routes";
import store from "./store/store";


export default function App() {
    return (
        <>
            <Provider store={store}>
                <RouterProvider router={appRouter} />
            </Provider>
        </>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);