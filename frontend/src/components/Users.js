import { useContext, useEffect, useState } from "react";
import { Context } from "../context/SharedState";
import { Link, useNavigate } from "react-router-dom";
import { initializeSocket, socket } from "./socket";

export default function Users() {
    const states = useContext(Context)

    useEffect(() => {
        initializeSocket(states.user?.username, states.setOnlineUsers);
    }, [states.isAuthenticated]);

    return (
        <>
            <div className="container text-center mt-5 col-5">
                <h4 className="text-success mb-3">Active Users: {states.onlineUsers.length}</h4>
                <ul className="list-group">
                    {states.onlineUsers.map((username) => (
                        <li key={username} className="list-group-item">
                            <Link to={`/chat/${username}`} className="text-primary text-decoration-none">
                                {username}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
