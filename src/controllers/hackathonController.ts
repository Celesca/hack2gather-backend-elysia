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
            id: t.String(),
        }),
        }
    )
    
    // Create a new hackathon
    .post(
        "/create",
        async ({ body: { name, description }, error }) => {
        // Validate the input
        if (!name || !description) {
            return error(400, "Name and description are required");
        }
    
        // Create the hackathon
        const newHackathon = await prisma.hackathon.create({
            data: {
            Name: name,
            Description: description,
            },
        });
    
        return newHackathon;
        },
        {
        body: t.Object({
            name: t.String(),
            description: t.String(),
        }),
        }
    )
    
    // Update an existing hackathon
    .put(
        "/update",
        async ({ body: { id, name, description }, error }) => {
        // Validate the input
        if (!id || !name || !description) {
            return error(400, "ID, name, and description are required");
        }
    
        // Update the hackathon
        const updatedHackathon = await prisma.hackathon.update({
            where: {
            HackathonID: id,
            },
            data: {
            Name: name,
            Description: description,
            },
        });
    
        return updatedHackathon;
        },
        {
        body: t.Object({
            id: t.String(),
            name: t.String(),
            description: t.String(),
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
    
        // Delete the hackathon