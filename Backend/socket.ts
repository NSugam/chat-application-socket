import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { messagesEntity } from "./src/entity/messagesEntity";
import { groupEntity } from "./src/entity/groupEntity";
import { userEntity } from "./src/entity/userEntity";

const messagesController = require('./src/controllers/messagesController')

const onlineUsers = new Map();
const groupSockets = new Map();

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
            socket.emit("join-chat-messages", oldMessages)
        });

        socket.on("join-group", async ({ groupName, username }) => {
            if (!groupName || !username) return;

            socket.join(groupName);

            if (!groupSockets.has(groupName)) groupSockets.set(groupName, new Set());

            groupSockets.get(groupName).add(username);

            const oldMessages = await messagesEntity.find({
                where: { group: { group_name: groupName } },
                relations: ["sender"],
                order: { timestamp: "ASC" }
            });

            socket.emit("join-group-messages", oldMessages);
        });

        socket.on("send-group-message", async ({ groupName, senderUsername, messageText }) => {
            if (!groupName || !senderUsername || !messageText.trim()) return;

            const sender = await userEntity.findOne({ where: { username: senderUsername } });
            if (!sender) return

            const group = await groupEntity.findOne({ where: { group_name: groupName } });
            if (!group) return

            const newMessage = messagesEntity.create({
                sender,
                group,
                message_text: messageText,
            });
            await newMessage.save();

            io.to(groupName).emit("receive-group-message", {
                senderUsername,
                messageText,
                timestamp: newMessage.timestamp
            });
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
