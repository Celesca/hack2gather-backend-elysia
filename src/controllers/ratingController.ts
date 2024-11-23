import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const ratingController = new Elysia({ prefix: "/rating" })

// Rating to someone
ratingController.post("/", async ({ body, error }) => {
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
});