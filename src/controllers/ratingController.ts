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

// Rating to someone
ratingController.post("/rateuser", async ({ body, error }) => {
    const { ratedByID, ratedUserID, ratingValue, comment } = body;

    // Check if the user exists
    const ratedBy = await prisma.user.findUnique({
        where: { UserID: ratedByID },
    });

    if (!ratedBy) {
        return error(404, "User not found");
    }

    // Check if the user exists
    const ratedUser = await prisma.user.findUnique({
        where: { UserID: ratedUserID },
    });

    if (!ratedUser) {
        return error(404, "User not found");
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
})