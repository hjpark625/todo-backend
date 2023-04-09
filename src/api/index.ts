import Router from 'koa-router';
import auth from './auth';
import todos from './todos';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/todos', todos.routes());

export default api;
