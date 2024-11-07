import { Elysia, t } from "elysia";
import { prisma } from "../prisma";

// Controller for handling swipe-related routes
export const swipeController = new Elysia({ prefix: "/swipe" })

  // Fetch a profile to swipe on
  .get(
    "/:userID",
    async ({ params: { userID }, error }) => {
      // Fetch a user that the current user hasn't swiped on yet
      const potentialMatch = await prisma.user.findFirst({
        where: {
          // Avoid users the current user has already swiped on
          SwipesReceived: {
            none: {
              SwipingUserID: userID,
            },
          },
          UserID: {
            not: userID, // Exclude the current user
          },
        },
        // You can add more complex logic here for filtering based on working style, location, etc.
      });

      if (!potentialMatch) {
        return error(404, "No more profiles available to swipe");
      }

      return potentialMatch; // Return the profile for swiping
    },
    {
      params: t.Object({
        userID: t.String(),
      }),
    }
  )

  // Process a swipe action (Like or Dislike)
  .post(
    "/:userID/swipe",
    async ({ params: { userID }, body: { swipedUserID, swipeAction }, error }) => {
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
        swipedUserID: t.String(),
        swipeAction: t.String(), // "Like" or "Dislike"
      }),
      params: t.Object({
        userID: t.String(),
      }),
    }
  );
