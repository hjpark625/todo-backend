import type { Context, Next } from 'koa';

const checkLoggedIn = (ctx: Context, next: Next) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
  return next();
};

export default checkLoggedIn;
