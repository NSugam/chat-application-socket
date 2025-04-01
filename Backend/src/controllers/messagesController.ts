import { messagesEntity } from "../entity/messagesEntity"
import { userEntity } from "../entity/userEntity";

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
