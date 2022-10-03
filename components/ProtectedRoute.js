import Router from 'next/router';
import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({children}) => {
    const {user} = useAuth();
    useEffect(()=>{
        if (!user){
            Router.push('/auth/login')
        }
        
    }, [user]) 
    return (
        <>
            {user ? children : null}
        </>
    )
}

export default ProtectedRoute
