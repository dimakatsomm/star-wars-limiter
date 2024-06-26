import { Model, Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import isEmail from 'validator/lib/isEmail';
import { IUser } from '../types/user.type';

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      required: true,
      default: randomUUID,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
      trim: true,
      required: true,
    },
    emailAddress: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate: [isEmail],
    },
  },
  {
    timestamps: true,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: function (doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const User = model<IUser, Model<IUser>>('User', userSchema, 'users');
