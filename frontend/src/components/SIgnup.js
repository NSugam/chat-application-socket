import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/SharedState';

export default function Signup() {
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

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post(states.hostname+'/api/user/register', userInput).then((res)=> {
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                navigate('/login')

            } else {
                toast.error(res.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }
        })
    }
    return (
        <>
            <div className='container col-sm-4 mt-5 pt-5'>
                <h2 className='text-center mb-4'>Welcome to RedPanda Shopping</h2>
                <hr className='m-auto w-50 mb-5' />
                <form onSubmit={handleSignup}>
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-control" name='username' onChange={handleInput} required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone number</label>
                        <input type="number" class="form-control" name='phone' onChange={handleInput} required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email address</label>
                        <input type="email" class="form-control" name='email' onChange={handleInput} required />
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" name='password' onChange={handleInput} required />
                    </div>
                    <div className='text-end'>
                        <button type='submit' class="btn btn-danger w-100">Signup</button>
                        <button class="btn btn-outline-dark w-100 mt-3" onClick={()=>navigate('/login')}>Already have a account</button>
                    </div>
                </form>
            </div>
        </>
    )
}
