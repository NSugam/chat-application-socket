const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
import { userEntity } from "../entity/userEntity";

exports.userRegister = async (req: any, res: any, next: any) => {
    const { username, email, password } = req.body;

    const checkUser = await userEntity.findOne({ where: { username: username } })
    const checkEmail = await userEntity.findOne({ where: { email: email } })

    if (checkEmail || checkUser) {
        return res.status(409).json({ message: "Account already exist", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt)
    await userEntity.create({
        username: username,
        email: email,
        password: secPass
    }).save()
    return res.status(200).json({ message: "Account Created", success: true })
}

exports.userLogin = async (req: any, res: any, next: any) => {
    const { email, password } = req.body;

    const user = await userEntity.findOne({ where: { email: email } })
    if (!user) return res.status(401).send({ message: "Invalid Credentials", success: false })

    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) return res.status(401).send({ message: "Invalid Credentials", success: false })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('__chatApp__', token, {
        sameSite: 'strict',
        httpOnly: true, 
        path: '/',
        secure: false,   // true in production with HTTPS
        expires: new Date(new Date().getTime() + 60 * 60 * 1000), //1hr
    });

    return res.status(200).json({ message: "Login Success", success: true, user })
}