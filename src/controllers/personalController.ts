import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const personalController = new Elysia({ prefix: "/personal" })

// Get PersonalType of the user
.get("/:userID", async ({ params: { userID }, error }) => {
    console.log(`Fetching personal type for userID: ${userID}`);

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        console.log(`User not found: ${userID}`);
        return error(404, "User not found");
    }

    // Get the personalTypeID of the user
    const personalTypeID = user.PersonalTypeID;

    if (!personalTypeID) {
        console.log(`Personal type not found for user: ${userID}`);
        return {
            userID: userID,
            personalType: null,
        };
    }

    // Get the personal type of the user
    const personalType = await prisma.personalType.findUnique({
        where: { PersonalTypeID: personalTypeID },
    });

    if (!personalType) {
        console.log(`Personal type not found: ${personalTypeID}`);
        return {
            userID: userID,
            personalType: null,
        };
    }

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
.post('/create', async ({ body, error }) => {
    const { personalType, personalTypeDetail } = body;

    // Create the new personal type
    const newPersonalType = await prisma.personalType.create({
        data: {
            PersonalType: personalType,
            PersonalTypeDetail: personalTypeDetail,
        },
    });

    return newPersonalType;
}, {
    body: t.Object({
        personalType: t.String(),
        personalTypeDetail: t.String(),
    }),
})

// Add the personal type to the user
.post('/addToUser', async ({ body, error }) => {
    const { userID, personalTypeID } = body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        return error(404, "User not found");
    }

    // Check if the personal type exists
    const personalType = await prisma.personalType.findUnique({
        where: { PersonalTypeID: personalTypeID },
    });

    if (!personalType) {
        return error(404, "Personal type not found");
    }

    // Add the personal type to the user
    const newPersonal = await prisma.user.update({
        where: { UserID: userID },
        data: {
            PersonalTypeID: personalTypeID,
        },
    });

    return newPersonal;
}, {
    body: t.Object({
        userID: t.String(),
        personalTypeID: t.Number(),
    }),
})

// Update the personal type of the user
.put('/update', async ({ body, error }) => {
    const { userID, personalTypeID } = body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        return error(404, "User not found");
    }

    // Check if the personal type exists
    const personalType = await prisma.personalType.findUnique({
        where: { PersonalTypeID: personalTypeID },
    });

    if (!personalType) {
        return error(404, "Personal type not found");
    }

    // Update the personal type of the user
    const updatedPersonal = await prisma.user.update({
        where: { UserID: userID },
        data: {
            PersonalTypeID: personalTypeID,
        },
    });

    return updatedPersonal;
}, {
    body: t.Object({
        userID: t.String(),
        personalTypeID: t.Number(),
    }),
})

// Delete the personal type of the user
.delete('/:userID', async ({ params, error }) => {
    const { userID } = params;

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        return error(404, "User not found");
    }

    // Update the personalTypeID to null
    const updatedPersonal = await prisma.user.update({
        where: { UserID: userID },
        data: {
            PersonalTypeID: null,
        },
    });

    return updatedPersonal;
}, {
    params: t.Object({
        userID: t.String(),
    }),
});