import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const hackathonController = new Elysia({ prefix: "/hackathon" })

    // Fetch all hackathons
    .get("/", async () => {
        const hackathons = await prisma.hackathon.findMany();
        return hackathons;
    })
    
    // Fetch a specific hackathon by ID
    .get(
        "/:id",
        async ({ params: { id }, error }) => {
        const hackathon = await prisma.hackathon.findUnique({
            where: {
            HackathonID: id,
            },
        });
    
        if (!hackathon) {
            return error(404, "Hackathon not found");
        }
    
        return hackathon;
        },
        {
        params: t.Object({
            id: t.Number(),
        }),
        }
    )
    
    // Create a new hackathon
    .post(
        "/create",
        async ({ body: { name, description, location, startDate, endDate, hackathonImage }, error }) => {
        // Validate the input
        if (!name || !description || !location || !startDate || !endDate) {
            return error(400, "Name and description are required");
        }
    
        const newHackathon = await prisma.hackathon.create({
            data: {
            Name: name,
            Description: description,
            StartDate: startDate,
            EndDate: endDate,
            Location: location,
            HackathonImage: hackathonImage,
            },
        });
    
        return newHackathon;
        },
        {
        body: t.Object({
            name: t.String(),
            description: t.String(),
            location: t.String(),
            startDate: t.String(),
            endDate: t.String(),
            hackathonImage: t.String(),
        }),
        }
    )

    // Update a hackathon
    .put(
        "/update",
        async ({ body: { id, name, description, location, startDate, endDate }, error }) => {
        // Validate the input
        if (!id || !name || !description || !location || !startDate || !endDate) {
            return error(400, "ID, name, and description are required");
        }
    
        const updatedHackathon = await prisma.hackathon.update({
            where: {
            HackathonID: id,
            },
            data: {
            Name: name,
            Description: description,
            StartDate: startDate,
            EndDate: endDate,
            Location: location,
            },
        });
    
        return updatedHackathon;
        },
        {
        body: t.Object({
            id: t.Number(),
            name: t.String(),
            description: t.String(),
            location: t.String(),
            startDate: t.String(),
            endDate: t.String(),
        }),
        }
    )

    // Delete a hackathon
    .delete(
        "/delete",
        async ({ body: { id }, error }) => {
        // Validate the input
        if (!id) {
            return error(400, "ID is required");
        }
    
        const deletedHackathon = await prisma.hackathon.delete({
            where: {
            HackathonID: id,
            },
        });
    
        return deletedHackathon;
        },
        {
        body: t.Object({
            id: t.Number(),
        }),
        }
    );