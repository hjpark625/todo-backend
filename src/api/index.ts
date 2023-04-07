import Router from 'koa-router';
import auth from './auth';

const api = new Router();

api.use('/auth', api.routes());

export default api;
