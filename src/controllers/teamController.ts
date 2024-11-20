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
    const { teamName, hackathonID } = body;

    // Check if team and hackathonID exists
    const hackathon = await prisma.hackathon.findUnique({
        where: { HackathonID: hackathonID },
    });

    if (!hackathon) {
        return error(404, "Hackathon not found");
    }

    const team = await prisma.team.findFirst({
        where: { TeamName: teamName, HackathonID: hackathonID },
    });

    if (team) {
        return error(400, "Team already exists");
    }

    const response = await prisma.team.create({
        data: {
            TeamName: teamName,
            HackathonID: hackathonID,
        },
    });

    return response;


}, {
    body: t.Object({
        teamName: t.String(),
        hackathonID: t.Number(),
    }),
})

.put("/update", async ({ body, error }) => {
    const { teamID, teamName } = body;

    const team = await prisma.team.update({
        where: { TeamID: teamID },
        data: {
            TeamName: teamName,
        },
    });

    return team;
}, {
    body: t.Object({
        teamID: t.Number(),
        teamName: t.String(),
    }),
})

.delete("/delete", async ({ body, error }) => {
    const { teamID } = body;

    const team = await prisma.team.delete({
        where: { TeamID: teamID },
    });

    return team;
}, {
    body: t.Object({
        teamID: t.Number(),
    }),
})