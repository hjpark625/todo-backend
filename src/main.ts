import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from '@koa/cors';
import jwtMiddleware from '@/lib/jwtMiddleware';
import api from '@/api';

dotenv.config();

const port = process.env.PORT || 4000;
const { MONGO_URI } = process.env;

mongoose
  .connect(`${MONGO_URI}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(cors({ credentials: true }));
// TODO: 나중에 https 배포할 때 필요한 코드
// app.use((ctx, next) => {
//   ctx.cookies.secure = true;
//   return next();
// });
app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`${port}번 포트에서 서비스 대기중`);
});
