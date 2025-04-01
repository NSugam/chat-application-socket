import { io } from 'socket.io-client';

export const socket = io('http://localhost:5050', {
    autoConnect: false
});

export const initializeSocket = (username, setOnlineUsers) => {

    if (!username) return;

    socket.connect()
    
    socket.emit("user-online", username);

    socket.on("online-users", (users) => {
        setOnlineUsers(users.filter((user) => user && user !== username));
    });
};