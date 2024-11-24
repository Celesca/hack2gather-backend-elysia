import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const personalController = new Elysia({ prefix: "/personal" })

// Get PersonalType of the user
.get("/:userID", async ({ params, error }) => {
    const { userID } = params;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        return error(404, "User not found");
    }

    // Get all personal information of the user
    const personal = await prisma.user.findMany({
        where: { UserID: userID },
    });

    // Get the personalTypeID of the user
    const personalTypeID = personal.length > 0 ? personal[0].PersonalTypeID : null;

    if (!personalTypeID) {
        return error(404, "Personal type not found");
    }

    // Get the personal type of the user
    const personalType = await prisma.personalType.findUnique({
        where: { PersonalTypeID: personalTypeID },
    });

    // Return the json of the userID and the personalType
    return {
        userID: userID,
        personalType: personalType,
    };
}, {
    params: t.Object({
        userID: t.String(),
    }),
})

// Create the new personal type in the personal table.