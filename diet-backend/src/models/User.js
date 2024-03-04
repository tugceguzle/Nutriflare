import mongoose from "mongoose";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // required: true,
    // toJSON: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  gender: {
    type: String,
    enum: ["male", "female" , "none"],
    default:"none"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  birthdayDate: {
    type: Date,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },
  weight_kg: {
    type: Number,
    default:0
  },
  size_cm: {
    type: Number,
    default:0
  },
  profilePhoto: {
    type: String,
    default:""
  },
  dietList: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(this.password, salt);
			this.password = hashed;
		}

		next();
	} catch (e) {
		next(error);
	}
});

UserSchema.methods.isValidPass = async function (pass) {
	return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model("user", UserSchema);

export default User;
