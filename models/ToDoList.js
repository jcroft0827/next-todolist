import { model, models, Schema } from "mongoose";

const ToDoListSchema = new Schema({
    task: {type: String, required: true},
    date: {type: Date},
    details: {type: String},
}, {
    timestamps: true,
});

export const ToDoList = models.ToDoList || model('ToDoList', ToDoListSchema);