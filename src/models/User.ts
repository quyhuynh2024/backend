import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
}
interface IUserMethods {
  comparePassword: (candidatePassword: string) => boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "invalid email address format",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.method(
  "comparePassword",
  async function (candidatePassword: string) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
