import getPrismaInstance from "../utils/PrismaClient.js";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    console.log("req.body", req.body);
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: {
            connect: { id: from },
          },
          receiver: {
            connect: { id: to },
          },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, receiver: true },
      });
      console.log("newMessage", newMessage);
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From,to and Message is required.");
  } catch (err) {
    next(err);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    console.log("req.params", req.params);

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            receiverId: to,
          },
          {
            senderId: to,
            receiverId: from,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    console.log("messages", messages);

    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });
    console.log("unreadMessages", unreadMessages);
    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = new Date.now();
      let fileName = "uploads/images" + date + req.file.originalName;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance;
      const { from, to } = req.query;
      console.log("req.query", req.query);

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "image",
          },
        });
        console.log("message", message);
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required");
    }
    return res.status(400).send("Image is required");
  } catch (err) {
    next(err);
  }
};
