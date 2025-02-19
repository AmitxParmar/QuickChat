import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required.", status: false });
    }

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
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

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      return res.send("Email, name and Image are required.");
    }
    const prisma = getPrismaInstance();

    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });
    return res.json({ msg: "Success", status: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });
    const userGroupedByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!userGroupedByInitialLetter[initialLetter]) {
        userGroupedByInitialLetter[initialLetter] = [];
      }
      userGroupedByInitialLetter[initialLetter].push(user);
    });

    return res.status(200).send({ users: userGroupedByInitialLetter });
  } catch (err) {
    next(err);
  }
};
export const generateToken = (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_APP_SECRET;
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";
    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      return res.status(200).json({ token });
    }
    return res.status(400).send("UserId, appId and serverSecret are required.");
  } catch (err) {
    next(err);
  }
};
