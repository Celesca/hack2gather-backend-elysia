import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const notificationController = new Elysia({ prefix: "/notify" })

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
    });