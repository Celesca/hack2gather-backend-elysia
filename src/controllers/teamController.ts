import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const teamController = new Elysia({ prefix: "/team" })

.get("/", async () => {
    const teams = await prisma.team.findMany();
    return teams;
})





  


































.get("/finduserteam/:teamID", async ({ params, error }) => {
    const teamID = parseInt(params.teamID, 10); // Ensure teamID is a number
    if (isNaN(teamID)) {
        return error(400, "Invalid teamID");
    }

    const team = await prisma.userTeam.findMany({
        where: {
            TeamID: teamID,
        },
    });

    if (!team || team.length === 0) {
        return error(404, "Team not found");
    }

    return team;
}, {
    params: t.Object({
        teamID: t.String(), // teamID is a string in the URL params
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


// Get users in a team
.get("/users/:teamID", async ({ params: { teamID }, error }) => {
    const users = await prisma.userTeam.findMany({
        where: {
            TeamID: parseInt(teamID, 10),
        },
        include: {
            User: true,
        },
    });

    if (!users || users.length === 0) {
        return error(404, "Users not found");
    }

    return users.map(userTeam => userTeam.User);
}, {
    params: t.Object({
        teamID: t.String(),
    }),
})

// Get Team by TeamID
.get("/getTeam", async ({ query: { TeamID }, error }) => {
    const team = await prisma.team.findFirst({
        where: {
          TeamID: TeamID,
        },
    });

    if (!team) {
        return error(404, "Team not found");
    }

    return team;
}, {
    query: t.Object({
        TeamID: t.Number(),
    }),
})

// Check if a user is part of a team
.get("/checkteam", async ({ query: { TeamID, UserID }, error }) => {
    if (!TeamID || !UserID) {
        return error(400, "TeamID and UserID are required");
    }

    const teamMember = await prisma.userTeam.findFirst({
        where: {
            TeamID: TeamID,
            UserID: UserID,
        },
    });

    if (!teamMember) {
        return error(404, "User is not part of the team");
    }

    return { valid: true };
}, {
    query: t.Object({
        TeamID: t.Number(),
        UserID: t.String(),
    }),
})

// Other endpoints...
// Get TeamID from TeamName
.get("/getTeamID", async ({ query: { TeamName }, error }) => {
    const team = await prisma.team.findFirst({
        where: {
            TeamName: TeamName,
        },
    });

    if (!team) {
        return error(404, "Team not found");
    }

    return {TeamID: team.TeamID};
  }, {
    query: t.Object({
        TeamName: t.String(),
    }),
  })