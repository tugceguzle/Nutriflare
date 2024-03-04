import React from "react";
import { Navigate , Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({userBool}) {
    const { user } = useAuth();
    if(user&& userBool && user.role!=="user"){
        return <Navigate to="/admin/home" />
    }
    else{
        return <Outlet/>
    }
}