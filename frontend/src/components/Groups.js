import React, { useContext, useEffect } from 'react'
import { Context } from '../context/SharedState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

export default function Groups() {
    const states = useContext(Context)

    useEffect(() => {
        states.setLoading(true)
        axios.get(states.hostname + '/api/groups/all').then((res) => {
            console.log("Groups Name:", res.data.allGroups)
            states.setGroupList(res.data.allGroups)
            states.setLoading(false)

        }).catch((error) => {
            console.log(error.response)
            states.setLoading(true)
        })
    }, [])

    if (states.Loading) return <Loader/>


    return (
        <>
            <div className="container text-center mt-5 col-md-3 col-sm-5">
                <h5 className="text-success mb-3">Available Groups: {states.groupList.length}</h5>
                <ul className="list-group">
                    {states.groupList?.map((group) => (
                        <li key={group.id} className="list-group-item">
                            <Link to={`/group-chat/${group.group_name}`} className="text-primary text-decoration-none">
                                {group.group_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
