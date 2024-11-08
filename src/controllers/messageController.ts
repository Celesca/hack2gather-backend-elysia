import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const messageController = new Elysia({ prefix: "/message" })

.post(

    "/start",
    async ({ body, error }) => {
      const { senderID, receiverID, messageContent } = body;

      // Check if both users exist
      const sender = await prisma.user.findUnique({
        where: { UserID: senderID },
      });

      const receiver = await prisma.user.findUnique({
        where: { UserID: receiverID },
      });

      if (!sender || !receiver) {
        return error(404, "Sender or receiver not found");
      }

      // Create the initial message
      const newMessage = await prisma.message.create({
        data: {
          SenderID: senderID,
          ReceiverID: receiverID,
          MessageContent: messageContent,
        },
      });

      return newMessage;
    },
    {
        body: t.Object({
            senderID: t.String(),
            receiverID: t.String(),
            messageContent: t.String(),
        }),
    }
  )