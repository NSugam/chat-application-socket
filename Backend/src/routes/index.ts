import { Router } from "express";
const router = Router();

router.use('/auth', require('./user'))


export default router;
