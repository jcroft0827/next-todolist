import { mongooseConnect } from "@/libs/mongoose";
import { ToDoList } from "@/models/ToDoList";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'POST') {
        const {task, date, details} = req.body;
        const todolistDoc = await ToDoList.create({
            task, date, details,
        })
        res.json(todolistDoc);
    }

    if (method === 'GET') {
        res.json(await ToDoList.find());
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await ToDoList.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }

    if (method === 'PUT') {
        const {task, date, details, _id} = req.body;
        await ToDoList.updateOne({_id}, {task, date, details,});
        res.json(true);
    }
}