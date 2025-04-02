import { Router } from "express";
import { userEntity } from "../entity/userEntity";
const router = Router();

const userController = require('../controllers/userController')

router.post('/register', userController.userRegister)

router.post('/login', userController.userLogin)

router.get('/all', async (req: any, res: any) => {
    const allUsers = await userEntity.find({ select: ['username'] })
    return res.status(200).json({ message: `All Users`, success: true, allUsers })
})

router.get('/profile', (req: any, res: any) => {
    return res.status(200).json({ message: `User logged In`, success: true, user: req.user })
})

router.get('/logout', async (req: any, res: any) => {
    res.cookie('__chatApp__', '', {
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
        secure: false,
        expires: new Date(0)
    });
    res.status(200).send({ message: "Logged out", success: true })
})

module.exports = router;