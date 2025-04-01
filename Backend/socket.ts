import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { messagesEntity } from "./src/entity/messagesEntity";

const messagesController = require('../Backend/src/controllers/messagesController')

const onlineUsers = new Map();

export const initializeSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            credentials: true,
            origin: ["http://localhost:3000"],
        },
    });
    io.listen(5050)

    io.on("connection", (socket) => {

        socket.on("user-online", (userId) => {
            onlineUsers.set(userId, socket.id);

            if (onlineUsers.has(null)) onlineUsers.delete(null)

            io.emit("online-users", Array.from(onlineUsers.keys()));
        })

        socket.on("send-message", (data) => {
            const { senderUsername, receiverUsername, messageText } = data;
            messagesController.saveMessage(data)

            const senderSocketId = onlineUsers.get(senderUsername);
            const receiverSocketId = onlineUsers.get(receiverUsername);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", data);
            }

            if (senderSocketId) {
                io.to(senderSocketId).emit("sent-message", data);
            }
        })

        socket.on("join-chat", async (data) => {
            const { senderUsername, receiverUsername } = data;

            if (senderUsername === undefined || receiverUsername === undefined) return;

            const oldMessages = await messagesEntity.find({
                where: [
                    { sender: { username: senderUsername }, receiver: { username: receiverUsername } },
                    { sender: { username: receiverUsername }, receiver: { username: senderUsername } }
                ],
                relations: ['sender', 'receiver'],
                order: {
                    timestamp: "ASC"
                }
            });
            socket.emit("join-chat", oldMessages)
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("online-users", Array.from(onlineUsers.keys()));
                    break;
                }
            }
        });
    });

    return io;
};
