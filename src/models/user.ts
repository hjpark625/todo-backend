import mongoose, { Schema } from 'mongoose';
import type { Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface UserSchemaType {
  username: string;
  hashedPassword: string;
  password?: string;
}
export interface UserInstanceType extends UserSchemaType {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => UserSchemaType;
  generateToken: () => string;
}
export interface UserModelType
  extends Model<UserSchemaType, {}, UserInstanceType> {
  findByUsername: (
    username: string,
  ) => Promise<HydratedDocument<UserSchemaType, UserInstanceType>>;
}

export interface UserInfoType {
  username: string;
  password: string;
}

const UserSchema = new Schema<UserSchemaType, UserModelType, UserInstanceType>({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
});

UserSchema.methods.setPassword = async function (password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};
UserSchema.methods.checkPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};
UserSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id as mongoose.ObjectId,
      username: this.username,
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '7d' },
  );
  return token;
};

const User = mongoose.model<UserSchemaType, UserModelType>('User', UserSchema);

export default User;
