import React, { useContext } from 'react'
import { Context } from '../context/SharedState'
import { Link, useNavigate } from 'react-router-dom'
import { socket } from './socket'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'

export default function Navbar() {
    const states = useContext(Context)
    const navigate = useNavigate()

    const handleLogout = () => {
        const logoutRequest = axios.get(states.hostname + '/api/auth/logout');

        toast.promise(
            logoutRequest, {
            pending: 'Logging out...',
            error: 'Network Error',
            success: "Account Logged out."
        }, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
        });

        logoutRequest.then((res) => {
            if (res.data.success) {
                socket.disconnect();
                states.setIsAuthenticated(false);
                states.setUser({})
                navigate('/login')
            } else {
                toast.error(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                    transition: Slide
                });
            }
        });
    };

    return (
        <>
            <div className='d-flex justify-content-around align-items-center mb-4 mt-4 text-light'>
                <Link to='/' className='btn btn-success'>Home</Link>
                <div>{states.user?.username || 'USER'}: {states.isConnected ? 'Online' : 'Offline'}</div>
                <div>
                    {states.isAuthenticated ?
                        <button type="button" onClick={handleLogout} className="btn btn-danger">Logout</button> :
                        <>
                            <Link type="button" to='/signup' className="btn btn-info me-2">Create account</Link>
                            <Link type="button" to='/login' className="btn btn-success">Login</Link>
                        </>
                    }
                </div>

            </div>
            <hr className='text-light w-75 m-auto' />
        </>
    )
}
