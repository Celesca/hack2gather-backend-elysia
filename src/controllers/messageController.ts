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

       // Also send a notification to the receiver
      await prisma.notification.create({
        data: {
          UserID: receiverID,
          NotificationContent: "You have a new message from " + sender.UserName,
        }});

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
  .get("/:senderID/:receiverID", async ({ params, error }) => {
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
        Timestamp: "asc",
      },
    });

    return messages;
  })

  // Query the message from each users that users contact with
  .get("/inbox/:userID", async ({ params, error }) => {
    const { userID } = params;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { UserID: userID },
    });

    if (!user) {
      return error(404, "User not found");
    }

    // Get the latest message from each conversation
    const latestMessages: any[] = await prisma.$queryRaw`
        SELECT 
          m1.*
        FROM 
          Message m1
        INNER JOIN (
          SELECT 
            LEAST(SenderID, ReceiverID) AS user1,
            GREATEST(SenderID, ReceiverID) AS user2,
            MAX(Timestamp) AS maxTimestamp
          FROM 
            Message
          WHERE 
            SenderID = ${userID} OR ReceiverID = ${userID}
          GROUP BY 
            user1, user2
        ) m2 ON 
          LEAST(m1.SenderID, m1.ReceiverID) = m2.user1 AND 
          GREATEST(m1.SenderID, m1.ReceiverID) = m2.user2 AND 
          m1.Timestamp = m2.maxTimestamp
      `;

    // get the user information of the other user in the conversation
    for (let i = 0; i < latestMessages.length; i++) {
      const message = latestMessages[i];
      const otherUser = await prisma.user.findUnique({
        where: { UserID: message.SenderID === userID ? message.ReceiverID : message.SenderID },
      });

      latestMessages[i].otherUser = otherUser;
    }


    return latestMessages;
  })

  // Delete a message
  .delete(
    "/delete/:messageID",
    async ({ params, error }) => {
      const { messageID } = params;

      // Check if the message exists
      const message = await prisma.message.findUnique({
        where: { MessageID: parseInt(messageID) },
      });

      if (!message) {
        return error(404, "Message not found");
      }

      // Delete the message
      await prisma.message.delete({
        where: { MessageID: parseInt(messageID) },
      });

      return { message: "Message deleted successfully" };
    },
    {
      params: t.Object({
        messageID: t.String(),
      }),
    }
  );
