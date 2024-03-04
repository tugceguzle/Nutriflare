import React from "react";
import { Navigate, Outlet  } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

export default function ProtectedAdmin({admin}) {
    const { user } = useAuth();
    if(admin && user && user.role!=="admin"){
        return <Navigate to="/home" />
    }
    else{
        return <Outlet/>
    }
    
}