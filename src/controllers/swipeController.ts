import { Elysia, t } from "elysia";
import { prisma } from "../prisma";

// Controller for handling swipe-related routes
export const swipeController = new Elysia({ prefix: "/swipe" })

  // Fetch all profiles to swipe on except the current user
  .get(
    "/:userID",
    async ({ params: { userID }, error }) => {
      // Fetch all users except the current user
      const potentialMatches = await prisma.user.findMany({
        where: {
          UserID: {
            not: userID, // Exclude the current user
          },
        },
        include: {
          UserSkills: {
            include: {
              Skill: true,
            },
          },
        },
      });

      if (potentialMatches.length === 0) {
        return error(404, "No more profiles available to swipe");
      }

      return potentialMatches; // Return the profiles for swiping
    },
    {
      params: t.Object({
        userID: t.String(),
      }),
    }
  )

  // Process a swipe action (Like or Dislike)
  .post(
    "/action",
    async ({ body: { userID, swipedUserID, swipeAction }, error }) => {
      // Check if the swipe action is valid ("Like" or "Dislike")
      if (!["Like", "Dislike"].includes(swipeAction)) {
        return error(400, "Invalid swipe action");
      }

      // Save the swipe result in the Swipe table
      const swipe = await prisma.swipe.create({
        data: {
          SwipingUserID: userID,
          SwipedUserID: swipedUserID,
          SwipeAction: swipeAction,
        },
      });

      // If the swipe was a "Like," check if it's a match
      if (swipeAction === "Like") {
        const match = await prisma.swipe.findFirst({
          where: {
            SwipingUserID: swipedUserID,
            SwipedUserID: userID,
            SwipeAction: "Like", // Check if the other user also swiped "Like"
          },
        });

        if (match) {
          // It's a match! You can now notify both users, create a match entry, etc.
          await prisma.notification.createMany({
            data: [
              {
                UserID: userID,
                NotificationContent: `You have a new match with ${swipedUserID}!`,
              },
              {
                UserID: swipedUserID,
                NotificationContent: `You have a new match with ${userID}!`,
              },
            ],
          });

          await prisma.message.createMany({
            data: [
              {
                SenderID: userID,
                ReceiverID: swipedUserID,
                MessageContent: "Matched!!",
              },
              {
                SenderID: swipedUserID,
                ReceiverID: userID,
                MessageContent: "Matched!!",
              },
            ],
          });

          return {
            message: "It's a match!",
            match: true,
          };
        }
      }

      return {
        message: "Swipe recorded",
        match: false,
      };
    },
    {
      body: t.Object({
        userID: t.String(),
        swipedUserID: t.String(),
        swipeAction: t.String(), // "Like" or "Dislike"
      }),
    }
  );