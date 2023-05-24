import Router from 'koa-router';
import * as todosCtrl from '@/api/todos/todos.ctrl';

const todos = new Router();

todos.get('/', todosCtrl.getTodos);
todos.post('/', todosCtrl.createTodo);
todos.delete('/:id', todosCtrl.deleteTodo);
todos.patch('/:id', todosCtrl.updateTodo);

export default todos;
