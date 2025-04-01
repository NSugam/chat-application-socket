import axios from 'axios';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import { Slide, toast } from 'react-toastify';
import { initializeSocket, socket } from '../components/socket';

const Context = createContext();

const SharedState = (props) => {

    const hostname = process.env.REACT_APP_LOCALHOST

    //Storing Socket connection
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [onlineUsers, setOnlineUsers] = useState([]);

    // Storing user details
    const [user, setUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false)



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
                toast.error(error.response?.data.message, {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark",
                    transition: Slide
                });
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
            user, setUser,
            isConnected, setIsConnected,
            onlineUsers, setOnlineUsers,
            isAuthenticated, setIsAuthenticated,
        }}>

            {props.children}

        </Context.Provider>
    );
};

export { Context, SharedState };
