import { Router } from "express";
const router = Router();

const messagesController = require('../controllers/messagesController')

router.get('/get', messagesController.getMessages)

module.exports = router;