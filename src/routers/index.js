import ChangePass from "../pages/changePass";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
export const publicRouter = [
    {
        path:"/",
        component:<Login/>
    },
    {
        path:"/register",
        component:<Register/>
    },
    {
        path:"/changepass",
        component:<ChangePass/>
    }
]
export const privateRouter = [
    {
        path:"/home/*",
        component:<Home/>
    }
]