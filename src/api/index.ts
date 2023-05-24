import Router from 'koa-router';
import auth from '@/api/auth';
import todos from '@/api/todos';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/todos', todos.routes());

export default api;
