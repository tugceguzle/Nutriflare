import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import Boom from "boom";
import ValidationSchema from "./validationLogin.js";

const Register = async (req, res, next) => {
  const input = req.body;
  try {
    const isExists = await User.findOne({ email: input.email });

    if (isExists) {
      return next(Boom.conflict("This e-mail already using."));
    }

    const user = new User(input);
    const data = await user.save();
    const userData = data.toObject();

    delete userData.password;
    delete userData.__v;

    res.json({
      user: userData,
    });
  } catch (e) {
    next(e);
  }
};

const Login = async (req, res, next) => {
  const input = req.body;
  const { error } = ValidationSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }
  try {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw Boom.notFound("The email address was not found.");
    }

    const isMatched = await user.isValidPass(input.password);
    if (!isMatched) {
      throw Boom.unauthorized("email or password not correct");
    }
    let options = {
      maxAge: 20 * 60 * 1000, // 1000ms*60 demek 1dk demek 20 ile çarp 20dk
      httpOnly: true,
    };
    const token = createToken(user._id);
    res.cookie("jwt", token, options);
    res.json({ user, token });
  } catch (e) {
    return next(e);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const allusers = await User.find({});
    res.json(allusers);
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) {
    console.log("user id yok");
  }
  try {
    const user = await User.findById(user_id);
    res.json(user);
  } catch (e) {
    console.log("hatalı");
    next(e);
  }
};

const Logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.json("User has been logged out.");
};

const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

const meGetUser = async (req, res, next) => {
  
  try {
    const { user_id } = req.payload;
    // const user_id = req.user_id;
    const user = await User.findById(user_id).select("-password -__v");
    res.json(user);
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
	const { user_id } = req.params;

	try {
		const updated = await User.findByIdAndUpdate(user_id , req.body, {
			new: true,
		}).select("-password -__v");

		res.json(updated);
	} catch (e) {
		next(e);
	}
};

export default { Register, Login, getAllUsers, getUser, Logout, meGetUser, updateUser };
