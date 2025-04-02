import { useContext, useEffect, useState } from "react";
import { Context } from "../context/SharedState";
import { Link } from "react-router-dom";

export default function ActiveUsers() {
    const states = useContext(Context)

    return (
        <>
            <div className="container text-center mt-5 col-md-3 col-sm-5">
                <h5 className="text-primary mb-3">Active Users: {states.onlineUsers.length}</h5>
                <ul className="list-group">
                    {states.onlineUsers.map((username) => (
                        <li key={username} className="list-group-item">
                            <Link to={`/chat/${username}`} className="text-success text-decoration-none">
                                {username} (Online)
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
