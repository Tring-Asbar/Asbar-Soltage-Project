import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import Dashboard from "../Pages/Dashboard/Dashboard";
import EditProfile from "../Pages/EditProfile/EditProfile";
import Notification from "../Pages/Notification/Notification";
import NYSLoad from "../Pages/NYSLoad/NYSLoad";
import Projects from "../Pages/Projects/Projects";
import ProjectTracking from "../Pages/ProjectTracking/ProjectTracking";
import UserManagement from "../Pages/UserManagement/UserManagement";

export const privateRoutes = [
    {
        path:'/dashboard',
        element:<Dashboard/>
    },
    {
        path:'/project-tracking',
        element:<ProjectTracking/>
    },
    {
        path:'/projects',
        element:<Projects/>,
    },
    {
        path:'/notification',
        element:<Notification/>
    },
    {
        path:'/changepassword',
        element:<ChangePassword/>
    },
    {
        path:'/nys_load',
        element:<NYSLoad/>
    },
    {
        path:'/usermanagement',
        element:<UserManagement/>
    },
    {
        path:'/editprofile',
        element:<EditProfile/>
    }
]