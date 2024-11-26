import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const teamController = new Elysia({ prefix: "/team" })

.get("/", async () => {
    const teams = await prisma.team.findMany();
    return teams;
})

// Get TeamID from name and hackathon
.get("/find", async ({ query: { teamName, hackathonID }, error }) => {
    const team = await prisma.team.findFirst({
        where: {
            TeamName: teamName,
            HackathonID: hackathonID,
        },
    });

    if (!team) {
        return error(404, "Team not found");
    }

    return team;
}, {
    query: t.Object({
        teamName: t.String(),
        hackathonID: t.Number(),
    }),
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
    const { teamName, hackathonID, maxMember } = body;
    console.log('Creating team with:', { teamName, hackathonID, maxMember });
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
            MaxMember: maxMember,
            CurrentMember: 0,
        },
    });

    return response;


}, {
    body: t.Object({
        teamName: t.String(),
        hackathonID: t.Number(),
        maxMember: t.Number(),
    }),
})

.put("/update", async ({ body, error }) => {
    const { teamID, teamName, maxMember } = body;

    const team = await prisma.team.update({
        where: { TeamID: teamID },
        data: {
            TeamName: teamName,
            MaxMember: maxMember,
        },
    });

    return team;
}, {
    body: t.Object({
        teamID: t.Number(),
        teamName: t.String(),
        maxMember: t.Number(),
    }),
})

.delete("/delete/:teamID", async ({ params, error }) => {
    const { teamID } = params;

    const team = await prisma.team.delete({
        where: { TeamID: teamID },
    });

    return team;
}, {
    params: t.Object({
        teamID: t.Number(),
    }),
})

.post("/addMember", async ({ body, error }) => {
    const { teamID, userID, role } = body;

    const team = await prisma.team.findUnique({
        where: { TeamID: teamID },
    });

    if (!team) {
        return error(404, "Team not found");
    }

    const user = await prisma.user.findUnique({
        where: { UserID: userID },
    });

    if (!user) {
        return error(404, "User not found");
    }

    const member = await prisma.userTeam.findFirst({
        where: { TeamID: teamID, UserID: userID },
    });

    if (member) {
        return error(400, "User is already a member of the team");
    }

    // Check the maxNUmber and the currentMember of the team
    if (team.CurrentMember >= team.MaxMember) {
        return error(400, "Team is full");
    }

    const response = await prisma.userTeam.create({
        data: {
            TeamID: teamID,
            UserID: userID,
            UserName: user.UserName,
            Role: role,
        },
    });

    // Add the current member count
    await prisma.team.update({
        where: { TeamID: teamID },
        data: {
            CurrentMember: team.CurrentMember + 1,
        },
    });

    return response;
}, {
    body: t.Object({
        teamID: t.Number(),
        userID: t.String(),
        role: t.String(),
    }),
})

// Remove member from team
.delete("/removeMember", async ({ body, error }) => {
    const { teamID, userID } = body;

    const team = await prisma.team.findUnique({
        where: { TeamID: teamID },
    });

    if (!team) {
        return error(404, "Team not found");
    }

    const member = await prisma.userTeam.findFirst({
        where: { TeamID: teamID, UserID: userID },
    });

    if (!member) {
        return error(404, "User is not a member of the team");
    }

    const response = await prisma.userTeam.delete({
        where: { UserTeamID: member.UserTeamID },
    });

    // Remove the current member count
    await prisma.team.update({
        where: { TeamID: teamID },
        data: {
            CurrentMember: team.CurrentMember - 1,
        },
    });

    return response;
}, {
    body: t.Object({
        teamID: t.Number(),
        userID: t.String(),
    }),
})