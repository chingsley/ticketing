import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties/methods
// that a User document (ie. a single from db user) has
// NOTE: a User document = user = an instance of a User
interface UserDoc extends UserAttrs, mongoose.Document {
  matchPassword(password: string): Promise<boolean>;
  // if we setup the user model to include timestamps, we would add the next 2 lines
  // createdAt: string;
  // updatedAt: string;
}

// An interface that describes the properties/methods
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.methods.matchPassword = function (suppliedPassword: string) {
  return Password.compare(this.password, suppliedPassword);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user = User.build({
  email: 'kcWmgsalf',
  password: 'salkfalfj',
});

export { User };
