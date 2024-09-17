import {createBrowserRouter} from "react-router-dom";
import {
    Booking,
    Signin
} from "../component";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Signin />
    },
    {
        path: "/booking",
        element: <Booking />
    }
]);


export default appRouter;