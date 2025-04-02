import { messagesEntity } from "../entity/messagesEntity"
import { userEntity } from "../entity/userEntity";

exports.getMessages = async (req: any, res: any) => {

    const logged_username = req.user.username

    const sender = await userEntity.findOne({
        where: { username: req.user.username },
        select: ['id', 'username', 'email']
    });

    const oldMessages = await messagesEntity.find({
        where: [
            { sender: { username: logged_username } },
            { receiver: { username: logged_username } }
        ],
        relations: ['sender', 'receiver'],
        order: {
            timestamp: "ASC"
        }
    });

    const Messages = oldMessages.map(message => ({
        ...message,
        sender: {
            username: message.sender.username,
        },
        receiver: {
            username: message.receiver?.username,
        },
    }));


    return res.status(200).json({ message: "All chat data", success: true, Messages })
}

exports.saveMessage = async (data: any) => {
    const { senderUsername, receiverUsername, messageText } = data

    const sender = await userEntity.findOne({ where: { username: senderUsername } });
    const receiver = await userEntity.findOne({ where: { username: receiverUsername } });

    if (!sender) {
        throw new Error("Sender not found")
    }

    if (!receiver) {
        throw new Error("Receiver not found")
    }

    await messagesEntity.create({
        sender,
        receiver,
        message_text: messageText,
        read_status: false,
        timestamp: new Date()
    }).save()
}
