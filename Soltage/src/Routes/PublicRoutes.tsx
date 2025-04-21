import SignIn from "../SignIn/SignIn";
import { SignUp } from "../SignUp/SignUp";

export const publicRoutes =[
    {
        path:'/signin',
        element:<SignIn/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    }
]
