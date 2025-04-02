import { Router } from "express";
import { groupEntity } from "../entity/groupEntity";
const router = Router();

router.get('/all', async (req: any, res: any) => {
    const allGroups = await groupEntity.find({
        relations: ['created_by'],
        select: { created_by: { username: true, email: true } }
    });

    return res.status(200).json({ message: `All Groups`, success: true, allGroups });
});

router.post('/add', async (req: any, res: any) => {
    const { group_name } = req.body
    const created_by = req.user

    const allGroups = await groupEntity.create({ group_name, created_by }).save()

    return res.status(200).json({ message: `New group Created`, success: true, allGroups })
})

module.exports = router;