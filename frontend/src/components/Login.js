import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../context/SharedState';
import { initializeSocket, socket } from './socket';

export default function Login() {
    const states = useContext(Context)
    const navigate = useNavigate()

    const [userInput, setUserInput] = useState({})
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const loginRequest = axios.post(states.hostname + '/api/auth/login', userInput);

        toast.promise(
            loginRequest.then(async (res) => {
                if (res.data.success) {
                    await states.setUser(res.data.user)
                    await states.setIsAuthenticated(true);
                    socket.connect()
                    initializeSocket()
                    navigate('/')
                    return 'Login successful!';
                } else {
                    socket.disconnect()
                    throw new Error(res.data.message);
                }
            }),
            {
                pending: 'Logging in...',
                success: 'Login successful!',
                error: {
                    render({ data }) {
                        return data.message || 'Login failed!';
                    },
                },
            },
            {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            }
        );
    }

    return (
        <>
            <div className='container bg-dark p-4 mt-5 rounded text-light col-6'>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" name='email' onChange={handleInput} />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" name='password' onChange={handleInput} />
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}
