import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const ratingController = new Elysia({ prefix: "/rating" })

// Get all ratings for a user
.get("/:ratedUserID", async ({ params, error }) => {
    const { ratedUserID } = params;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { UserID: ratedUserID },
    });

    if (!user) {
      return error(404, "User not found");
    }

    // Get all ratings for the user
    const ratings = await prisma.userRating.findMany({
      where: { RatedUserID: ratedUserID },
    });

    return ratings;
  }, {
    params: t.Object({
      ratedUserID: t.String(),
    }),
  })



// Rate someone
.post("/rateuser", async ({ body, error }) => {
    const { ratedByID, ratedUserID, ratingValue, comment } = body;

    // Prevent users from rating themselves
    if (ratedByID === ratedUserID) {
      return error(400, "You cannot rate yourself.");
    }

    // Check if the user who is rating exists
    const ratedBy = await prisma.user.findUnique({
      where: { UserID: ratedByID },
    });

    if (!ratedBy) {
      return error(404, "Rater user not found.");
    }

    // Check if the user to be rated exists
    const ratedUser = await prisma.user.findUnique({
      where: { UserID: ratedUserID },
    });

    if (!ratedUser) {
      return error(404, "Rated user not found.");
    }

    // Check for existing rating to prevent duplicates
   // Correct usage based on the unique constraint name
const existingRating = await prisma.userRating.findUnique({
    where: {
        ratedByRatedUser_unique: { // Use exact name
        RatedByID: ratedByID,
        RatedUserID: ratedUserID,
      },
    },
  });

    if (existingRating) {
      return error(400, "You have already rated this user.");
    }

    // Create the new rating
    const newRating = await prisma.userRating.create({
      data: {
        RatedByID: ratedByID,
        RatedUserID: ratedUserID,
        RatingValue: ratingValue,
        Comment: comment,
      },
    });

    return newRating;

  }, {
    body: t.Object({
      ratedByID: t.String(),
      ratedUserID: t.String(),
      ratingValue: t.Number(),
      comment: t.Optional(t.String()),
    }),
  })
// Other endpoints...

// Update rating
.put("/:userRatingID", async ({ params, body, error }) => {
    const { userRatingID } = params;
    const { ratingValue, comment } = body;

    // Check if the rating exists
    const rating = await prisma.userRating.findUnique({
      where: { UserRatingID: userRatingID },
    });

    if (!rating) {
      return error(404, "Rating not found");
    }

    // Update the rating
    const updatedRating = await prisma.userRating.update({
      where: { UserRatingID: userRatingID },
      data: {
        RatingValue: ratingValue,
        Comment: comment,
      },
    });

    return updatedRating; // Return the updated rating
  }, {
    params: t.Object({
      userRatingID: t.Number(),
    }),
    body: t.Object({
      ratingValue: t.Optional(t.Number()),
      comment: t.Optional(t.String()),
    }),
  });