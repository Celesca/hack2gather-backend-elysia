import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const teamController = new Elysia({ prefix: "/team" })

.get("/", async () => {
    const teams = await prisma.team.findMany();
    return teams;
})

.get("/hackathon/:id", async ({ params: { id }, error }) => {
    const teams = await prisma.team.findMany({
        where: {
            HackathonID: id,
        },
    });

    if (!teams) {
        return error(404, "Teams not found");
    }

    return teams;
},
{
    params: t.Object({
        id: t.Number(),
    }),
}
)

.post("/create", async ({ body, error }) => {
    const { TeamName, HackathonID, TeamMembers 