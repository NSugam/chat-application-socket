import React, { useContext, useEffect, useState } from 'react'
import ActiveUsers from './ActiveUsers'
import axios from 'axios'
import { Context } from '../context/SharedState'
import { Link } from 'react-router-dom'
import Loader from './Loader'
import Groups from './Groups'

export default function Homepage() {
    const states = useContext(Context)

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        states.setLoading(true)
        axios.get(states.hostname + '/api/auth/all').then((res) => {
            setAllUsers(res.data.allUsers)

        }).catch((error) => {
            console.log(error.response)
            states.setLoading(true)
        })
    }, [])

    if (states.Loading) return <Loader />

    return (
        <>
            <ActiveUsers />
            <Groups />

            <div className="container text-center mt-5 col-md-3 col-sm-5">
                <h5 className="text-success mb-3">All Users: {allUsers?.length - 1}</h5>
                <ul className="list-group">
                    {allUsers
                        .filter(user => user.username !== states.user?.username)
                        .map((user) => (
                            <li key={user.username} className="list-group-item">
                                <Link to={`/chat/${user.username}`} className="text-primary text-decoration-none">
                                    {user.username}
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>

        </>
    )
}
