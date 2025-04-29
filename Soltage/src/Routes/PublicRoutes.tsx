import SignIn from "../SignIn/SignIn";
import { SignUp } from "../SignUp/SignUp";
import { Navigate } from "react-router-dom";

export const publicRoutes =[
    {
        path: '/',
        element: <Navigate to="/signin" replace />
    },
    {
        path:'/signin',
        element:<SignIn/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    }
]
