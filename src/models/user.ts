import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Model, HydratedDocument } from 'mongoose';

export interface UserSchemaType {
  email: string;
  username: string;
  hashedPassword: string;
  password?: string;
  registerdAt: Date;
  updatedAt: Date;
}
export interface UserInstanceType extends UserSchemaType {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  serialize: () => UserSchemaType;
  generateToken: () => string;
}
export interface UserModelType
  extends Model<UserSchemaType, {}, UserInstanceType> {
  findByUserEmail: (
    email: string,
  ) => Promise<HydratedDocument<UserSchemaType, UserInstanceType>>;
}

export interface UserInfoType {
  email: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<UserSchemaType, UserModelType, UserInstanceType>({
  email: { type: String, required: true },
  username: { type: String },
  hashedPassword: { type: String, required: true },
  registerdAt: { type: Date },
  updatedAt: { type: Date },
});

UserSchema.methods.setPassword = async function (password: string) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};
UserSchema.methods.checkPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};
UserSchema.statics.findByUserEmail = function (email: string) {
  return this.findOne({ email });
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
      email: this.email,
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '7d' },
  );
  return token;
};

const User = mongoose.model<UserSchemaType, UserModelType>('User', UserSchema);

export default User;
