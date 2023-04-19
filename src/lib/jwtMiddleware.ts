import type { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface DecodedInfo extends jwt.JwtPayload {
  _id: string;
  email: string;
}

const jwtMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as DecodedInfo;
    ctx.state.user = {
      _id: decoded._id,
      email: decoded.email,
    };
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp - (now / 60) * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      if (user == null) return;
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
