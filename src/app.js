import { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
  } from "react-router-dom";
import { CheckLogin } from "./components/checkLogin";
import { useState } from "react";
import { privateRouter, publicRouter } from "./routers";
export default function App() {
    const [check,setCheck] = useState(false)
    useEffect(()=>{
        setCheck(CheckLogin());
    },[])
    return ( 
        <Router>
            <Routes>
                {publicRouter.map((route,index)=>(
                    <Route key={index} path={route.path} element = {route.component}/>
                ))}
                {privateRouter.map((route,index)=>(
                    <Route key={index} path={route.path} element = {check ? route.component : <Navigate to= "/"/>}/>
                ))}
            </Routes>
        </Router>
     );
}