import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createError } from "../utils/error";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.status(200).send("User has been created!!");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) next(createError(404, "No user found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect)
      return next(createError(400, "Wrong passowrd or username!"));

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT,
    );
    console.log(
      "NOTE:log the user object and extract the the password and other details",
    );
    const { password, ...otherDetails } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        details: { ...otherDetails },
      });
  } catch (error) {
    next(error);
  }
};
