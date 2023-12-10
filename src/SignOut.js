import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        alert("LogOut Successfull");

        navigate('/login', { replace: true });
    }, [navigate])
    return (
        <div></div>
    )
}

export default SignOut;