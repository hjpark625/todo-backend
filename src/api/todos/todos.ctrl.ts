import Joi from 'joi';
import Todo from '../../models/todo';
import type { Context } from 'koa';
import type { TodoSchemaType } from '../../models/todo';

export const getTodos = async (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
  try {
    const todo = await Todo.find({ 'user._id': user._id });
    ctx.body = todo;
    return;
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};

export const createTodo = async (ctx: Context) => {
  const schema = Joi.object().keys({
    text: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
  const { text } = ctx.request.body as TodoSchemaType;
  const todo = new Todo({
    text,
    isCompleted: false,
    createdAt: new Date(),
    user,
  });
  try {
    await todo.save();
    ctx.body = todo;
    return;
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};

export const deleteTodo = async (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
  const { id } = ctx.params;
  try {
    await Todo.findByIdAndRemove(id);
    ctx.status = 204;
    return;
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};

export const updateTodo = async (ctx: Context) => {
  const schema = Joi.object().keys({
    text: Joi.string().optional(),
    isCompleted: Joi.boolean().optional(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: '로그인이 필요합니다.',
    };
    return;
  }
  const { id } = ctx.params;
  const { text, isCompleted } = ctx.request.body as TodoSchemaType;
  try {
    await Todo.findByIdAndUpdate(id, {
      text,
      isCompleted,
    });
    ctx.status = 200;
    return;
  } catch (e) {
    ctx.throw(`${e}`, 500);
  }
};
