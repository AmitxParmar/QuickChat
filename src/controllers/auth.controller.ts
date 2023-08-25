import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createError } from "../utils/error";
import { NextFunction, Request, Response } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("registerring......", req.body);
  const { email,firstname,lastname}=req.body
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      email,
      firstname,
      lastname,
      password: hash
    });
    
    await newUser.save();
    console.log("user created!");
    res.status(200).send({
      userInfo: {
        email, firstname, lastname
      }
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) next(createError("No user found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect)
      return next(createError("Wrong passowrd or username!"));

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
