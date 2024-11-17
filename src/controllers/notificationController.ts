import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const notificationController = new Elysia({ prefix: "/noti" })

.get("/:userID", async ({ params, error }) => {
    const { userID } = params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });
    
    if (!user) {
        return error(404, "User not found");
    }
    
    // Get all notifications for the user
    const notifications = await prisma.notification.findMany({
        where: { UserID: userID },
    });
    
    return notifications;
    })

// Check if the user has any unread notifications
.get("/:userID/unread", async ({ params, error }) => {
    const { userID } = params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });
    
    if (!user) {
        return error(404, "User not found");
    }
    
    // Get all unread notifications for the user
    const notifications = await prisma.notification.findMany({
        where: { UserID: userID, ReadStatus: false },
    });
    
    return notifications;
},
{
    params: t.Object({
        userID: t.String(),
    }),
})

// Change the read status of a notification
.put("/:notificationID", async ({ params, body, error }) => {
    const { notificationID } = params;
    const { ReadStatus } = body;
    
    // Check if notification exists
    const notification = await prisma.notification.findUnique({
        where: { NotificationID: notificationID },
    });
    
    if (!notification) {
        return error(404, "Notification not found");
    }
    
    // Update the read status
    await prisma.notification.update({
        where: { NotificationID: notificationID },
        data: { ReadStatus },
    });
    
    return { message: "Read status updated successfully" };
},
{
    params: t.Object({
        notificationID: t.Number(),
    }),
    body: t.Object({
        ReadStatus: t.Boolean(),
    }),
})