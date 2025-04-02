import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context/SharedState';
import { socket } from './socket';

export default function Chat() {
    const { username } = useParams();
    const states = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [messagesHistory, setMessagesHistory] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        console.log(states.onlineUsers)
        if (!username) return;

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            console.log("Received:", message);
        };

        const handleSentMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            console.log("Sent:", message);
        };

        const handleJoinChat = (chatHistory) => {
            setMessagesHistory(chatHistory);
            console.log("Chat history loaded:", chatHistory);
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("sent-message", handleSentMessage);
        socket.on("join-chat-messages", handleJoinChat);

        socket.emit("join-chat", {
            senderUsername: states.user.username,
            receiverUsername: username
        });

        return () => {
            socket.off('receive-message');
            socket.off('sent-message');
            socket.off('join-chat');
        };

    }, [username, states.user?.username]);

    // Handle sending a message
    const sendMessage = () => {
        socket.emit('send-message', {
            senderUsername: states.user.username,
            receiverUsername: username,
            messageText: input,
        });
        setInput('');
    };

    return (
        <div className='container col-sm-7 col-md-4 rounded bg-dark mt-5' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h5 className='text-light mt-2 p-2 sticky-top bg-success rounded'style={{zIndex: 100}}>{username}</h5>
            <hr className='text-light'/>
            <div className="chat-history-messages mx-4">
                {messagesHistory
                    .filter((msg) =>
                        (msg.sender.username === username && msg.receiver.username === states.user.username) ||
                        (msg.receiver.username === username && msg.sender.username === states.user.username)
                    )
                    .map((msg, index) => (
                        <div key={index} className='my-3 container bg-light p-2 rounded rounded-5'>
                            <strong className={msg.sender.username === username ? 'text-danger' : 'text-success'}>
                                {msg.sender.username === username ? msg.sender.username : 'Me'}:
                            </strong>
                            <span className='text-dark'> {msg.message_text}</span>
                        </div>
                    ))
                }
            </div>
            <div className="chat-messages mx-4">
                {messages
                    .filter((msg) =>
                        (msg.senderUsername === username && msg.receiverUsername === states.user.username) ||
                        (msg.receiverUsername === username && msg.senderUsername === states.user.username)
                    )
                    .map((msg, index) => (
                        <div key={index} className='my-3 container bg-light p-2 rounded'>
                            <strong className={msg.senderUsername === username ? 'text-danger' : 'text-success'}>
                                {msg.senderUsername === username ? msg.senderUsername : 'Me'}:
                            </strong>
                            <span className='text-dark'> {msg.messageText}</span>
                        </div>
                    ))
                }
            </div>
            <hr className='text-light'/>

            <div className="bg-dark p-3 d-flex align-items-center sticky-bottom">                
            <input
                    className="col-sm-9 rounded p-2 me-2 col-10"
                    name="message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="btn btn-primary me-2" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
