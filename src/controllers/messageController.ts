import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const messageController = new Elysia({ prefix: "/message" })

  // Send a message in an existing thread
  .post(
    "/send",
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

      // Create the message
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

  // Get all messages between two users
  .get(
    "/:senderID/:receiverID",
    async ({ params, error }) => {
      const { senderID, receiverID } = params;

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

      // Get all messages between the two users
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { SenderID: senderID, ReceiverID: receiverID },
            { SenderID: receiverID, ReceiverID: senderID },
          ],
        },
        orderBy: {
          Timestamp: 'asc',
        },
      });

      return messages;
    }
  )

  // Query the message from each users that users contact with
  .get(
    "/inbox/:userID",
    async ({ params, error }) => {
      const { userID } = params;

      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { UserID: userID },
      });

      if (!user) {
        return error(404, "User not found");
      }

      // Get the latest message from each conversation
      const latestMessages = await prisma.$queryRaw`
        SELECT DISTINCT ON (LEAST("SenderID", "ReceiverID"), GREATEST("SenderID", "ReceiverID"))
          "MessageID", "SenderID", "ReceiverID", "MessageContent", "Timestamp"
        FROM "Message"
        WHERE "SenderID" = ${userID} OR "ReceiverID" = ${userID}
        ORDER BY LEAST("SenderID", "ReceiverID"), GREATEST("SenderID", "ReceiverID"), "Timestamp" DESC
      `;

      return latestMessages;
    }
  );