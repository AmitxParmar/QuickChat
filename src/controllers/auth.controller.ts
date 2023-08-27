import User, { IUser } from "../models/User";
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
  const { email, firstname, lastname } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      email,
      firstname,
      lastname,
      password: hash,
    });

    const userInfo = await newUser.save();
    console.log("User Createddddd!", userInfo);
    res.status(200).send({
      success: true,
      message: "User Created Successfully!",
      userInfo,
    });
  } catch (error) {
    next(error);
    throw new Error(error.message);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("ifUser found object", user);
    if (!user) {
      next(createError("No user found!"));
      throw new Error("No user Found!");
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      next(createError("Wrong password or username!")); // Return after calling next
      throw new Error("Invalid password or");
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_KEY,
    );

    const { password, ...otherDetails } = user;
    console.log(password, " password");
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        userInfo: { ...otherDetails },
      });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.userId;

  console.log("into updateUser");
  try {
    const updateFields: Partial<IUser> = { ...req.body };

    if (req.body.userType === "organization") {
      updateFields.organization = req?.body?.organization;
    } else if (req.body.userType === "company") {
      updateFields.company = req?.body?.company;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true },
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "User Updated Successfully!",
      userInfo: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
