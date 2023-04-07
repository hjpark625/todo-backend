import Joi from 'joi';
import User from '../../models/user';
import type { Context } from 'koa';
import type { UserInstanceType, UserInfoType } from '../../models/user';

export const register = async (ctx: Context) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body as UserInfoType;

  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }
    const user = new User({
      username,
    });

    await user.setPassword(password);
    await user.save();

    const data = user.toJSON();

    delete data.password;
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};

export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body as UserInfoType;
  if (!username || !password) {
    ctx.status = 401;
    ctx.body = {
      message: '회원가입을 해주세요',
    };
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        message: '존재하지 않는 사용자입니다.',
      };
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      ctx.body = {
        messsage: '비밀번호가 일치하지 않습니다.',
      };
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};

export const check = async (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
};

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
