import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';

const { Schema } = mongoose;

export interface TodoSchemaType {
  text: string;
  isCompleted: boolean;
  createdAt: Date;
  user: {
    _id: ObjectId;
    email: string;
  };
}

const TodoSchema = new Schema<TodoSchemaType>({
  text: String,
  isCompleted: Boolean,
  createdAt: Date,
  user: {
    _id: mongoose.Types.ObjectId,
    email: String,
  },
});

const Todo = mongoose.model<TodoSchemaType>('Todo', TodoSchema);

export default Todo;
