import getPrismaInstance from "../utils/PrismaClient";
import { NextFunction, Request, Response } from "express";

// If you have a type for User, import it from your Prisma types, e.g.:
// import { User } from "@prisma/client";

type User = {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  about: string;
};

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.json({ msg: "Email is required.", status: false });
      return;
    }

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.json({ msg: "User not found", status: false });
    } else {
      res.json({ msg: "User found", status: true, data: user });
    }
  } catch (err) {
    next(err);
  }
};

/* export const updatePfp = async() => {
  const prisma = getPrismaInstance()
  const updatedPfp = await prisma.user.update({
    where: { email: "amitparmar901@gmail.com" },
    data: {
      profilePicture:
        "https://lh3.googleusercontent.com/a/AAcHTteCNgEcE8KDiE1NyR869xPoIJthKtBMOioTM-pOQvn49nQ=s96-c",
    },
  });
};
updatePfp(); */

export const onBoardUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      res.send("Email, name and Image are required.");
      return;
    }
    const prisma = getPrismaInstance();

    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });
    res.json({ msg: "Success", status: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = getPrismaInstance();
    const users: User[] = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });

    // Use an index signature for the grouping object
    const userGroupedByInitialLetter: { [key: string]: User[] } = {};
    users.forEach((user: User) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!userGroupedByInitialLetter[initialLetter]) {
        userGroupedByInitialLetter[initialLetter] = [];
      }
      userGroupedByInitialLetter[initialLetter].push(user);
    });

    res.status(200).send({ users: userGroupedByInitialLetter });
  } catch (err) {
    next(err);
  }
};
