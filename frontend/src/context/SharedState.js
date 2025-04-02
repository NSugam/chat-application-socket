import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import { initializeSocket, socket } from '../components/socket';

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_HOSTNAME

    const [loading, setLoading] = useState(false)

    // Storing user details
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    //Storing Socket connection
    const [isConnected, setIsConnected] = useState(socket.connected)

    //Storing list of active users
    const [onlineUsers, setOnlineUsers] = useState([]);

    //Storing list of available groups
    const [groupList, setGroupList] = useState([]);

    //Fetch list of active users
    useEffect(() => {
        initializeSocket(user?.username, setOnlineUsers);
    }, [isAuthenticated]);

    //Fetch loggedIn user profile details
    useEffect(() => {
        const fetchuser = async () => {
            await axios.get(hostname + '/api/auth/profile').then((res) => {
                if (res.data.success) {
                    setIsAuthenticated(res.data.success);
                    setUser(res.data.user);
                    initializeSocket(res.data.user.username, setOnlineUsers)
                }

            }).catch((error) => {
                console.error('Error backend response:', error);
            });
        };

        fetchuser()
    }, [])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])

    return (
        <Context.Provider value={{
            hostname,
            loading, setLoading,
            user, setUser,
            isConnected, setIsConnected,
            onlineUsers, setOnlineUsers,
            groupList, setGroupList,
            isAuthenticated, setIsAuthenticated,
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };
