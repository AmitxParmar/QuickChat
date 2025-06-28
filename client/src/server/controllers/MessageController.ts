import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../utils/PrismaClient";

import { onlineUsers } from "../socket";
import { MulterHandler, MsgQuery } from "../types/ServerTypes";
import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";

import { renameSync } from "fs";

type MessageWithUsers = Prisma.MessagesGetPayload<{
  include: { sender: true; receiver: true };
}>;

type UserWithMsgs = Prisma.UserGetPayload<{
  include: {
    sentMessages: {
      include: { sender: true; receiver: true };
      orderBy: { createdAt: "desc" };
    };
    receivedMessages: {
      include: { sender: true; receiver: true };
      orderBy: { createdAt: "desc" };
    };
  };
}>;

export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
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
      res.status(201).send({ message: newMessage });
    }
    res.status(400).send("From,to and Message is required.");
  } catch (err) {
    next(err);
  }
};

export const getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;

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

    const unreadMessages: string[] = [];

    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.senderId === to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });
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
export const addImageMessage: RequestHandler<{}, any, any, MsgQuery> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) return void res.status(400).send("Image is required");

    const date = new Date();
    const fileName = `uploads/images/${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getDate()}_${req.file.originalname}`;

    const prisma = getPrismaInstance();
    const { from, to } = req.query; // typed as string

    if (!from || !to)
      return void res.status(400).send('"from" and "to" are required');

    const message = await prisma.messages.create({
      data: {
        message: fileName,
        sender: { connect: { id: from } },
        receiver: { connect: { id: to } },
        type: "image",
      },
    });

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

export const addAudioMessage = async (
  req: Request<{}, {}, {}, MsgQuery> & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = getPrismaInstance();
    if (req.file) {
      const date = Date.now();
      const fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);

      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "audio",
          },
        });
        res.status(201).json({ message });
      }
      res.status(400).send("From and to are required.");
    }
    res.status(400).send("Audio is required.");
  } catch (err) {
    next(err);
  }
};

// Get the lastest message of each contact
// Example data: {users:[...messages, ...onlineUsers]}
export const getInitialContactswithMessages = async (
  req: Request<{ from: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const prisma = getPrismaInstance();
  try {
    const userId = req.params.from; //Do not parse as integer.  The ID is a string.
    // get sent msg & received msg from userId
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })) as UserWithMsgs | null;

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    /** ---------- merge / sort ---------- */
    const messages: MessageWithUsers[] = [
      ...user?.sentMessages,
      ...user?.receivedMessages,
    ];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    /** ---------- aggregate per‑contact ---------- */
    interface ContactSummary {
      messageId: string;
      type: string;
      message: string;
      messageStatus: string;
      createdAt: Date;
      senderId: string;
      receiverId: string;
      totalUnreadMessages: number;
      // + any extra user fields (name, avatar, …)
      id: string;
      name?: string;
    }

    // Map(key,value) data structure -> return non-repeat data
    const users = new Map<string, ContactSummary>();
    const messageStatusChange: string[] = [];

    // 1. Minh Nghia
    // 2. Johnny Depth
    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const otherId = isSender ? msg.receiverId : msg.senderId;

      if (msg.messageStatus === "sent") messageStatusChange.push(msg.id);

      const base: ContactSummary = {
        messageId: msg.id,
        type: msg.type,
        message: msg.message,
        messageStatus: msg.messageStatus,
        createdAt: msg.createdAt,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        totalUnreadMessages: 0,
        ...(isSender ? msg.receiver : msg.sender), // merge user fields
      };

      if (!users.has(otherId)) {
        base.totalUnreadMessages =
          !isSender && msg.messageStatus !== "read" ? 1 : 0;
        users.set(otherId, base);
      } else if (!isSender && msg.messageStatus !== "read") {
        const u = users.get(otherId)!;
        users.set(otherId, {
          ...u,
          totalUnreadMessages: u.totalUnreadMessages + 1,
        });
      }
    });

    /** ---------- bulk update 'sent' → 'delivered' ---------- */
    if (messageStatusChange.length) {
      await prisma.messages.updateMany({
        where: { id: { in: messageStatusChange } },
        data: { messageStatus: "delivered" },
      });
    }

    /** ---------- response ---------- */
    res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: [], // you’ll fill this from your socket layer
    });
  } catch (err) {
    next(err);
  }
};
