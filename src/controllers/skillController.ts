import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const skillController = new Elysia({ prefix: "/skill" })

    .post(
        "/create",
        async ({ body, error }) => {
            const { skillName } = body;

            const existingSkill = await prisma.skills.findUnique({
                where: { Skill_Name: skillName },
            });

            if (existingSkill) {
                return error(409, "Skill already exists");
            }

            const newSkill = await prisma.skills.create({
                data: {
                    Skill_Name: skillName,
                },
            });

            return newSkill;
        },
        {
            body: t.Object({
                skillName: t.String(),
            }),
        }
    )

    .delete(":skillName", async ({ params: { skillName }, error }) => {
        const skill = await prisma.skills.findUnique({
            where: { Skill_Name: skillName },
        });

        if (!skill) {
            return error(404, "Skill not found");
        }

        await prisma.skills.delete({
            where: { Skill_Name: skillName },
        });

        return { message: "Skill deleted successfully" };
    }, {
        params: t.Object({
            skillName: t.String(),
        }),
    }
    )

    // Add skill to user
    .post(
        "/add-to-user",
        async ({ body, error }) => {
            const { userID, skillName } = body;

            const user = await prisma.user.findUnique({
                where: { UserID: userID },
            });

            if (!user) {
                return error(404, "User not found");
            }


            const skill = await prisma.skills.findUnique({
                where: { Skill_Name: skillName },
            });


            // If the skill doesn't exist, create it
            if (!skill) {
                const newSkill = await prisma.skills.create({
                    data: {
                        Skill_Name: skillName,
                    },
                });

                await prisma.userSkills.create({
                    data: {
                        UserID: userID,
                        Skill_ID: newSkill.Skill_ID,
                    },
                });
                

            }

            // If the skill exists, add it to the user
            else {
                const userSkill = await prisma.userSkills.findFirst({
                    where: {
                        UserID: userID,
                        Skill_ID: skill.Skill_ID,
                    },
                });

                if (userSkill) {
                    return error(409, "User already has this skill");
                }

                await prisma.userSkills.create({
                    data: {
                        UserID: userID,
                        Skill_ID: skill.Skill_ID,
                    },
                });
            }
        },
        {
            body: t.Object({
                userID: t.String(),
                skillName: t.String(),
            }),
        }
    )

    // Remove skill from user
    .delete(
        "/remove-from-user",
        async ({ body, error }) => {
            const { userID, skillName } = body;

            const skill = await prisma.skills.findUnique({
                where: { Skill_Name: skillName },
            });

            if (!skill) {
                return error(404, "Skill not found");
            }

            const user = await prisma.user.findUnique({
                where: { UserID: userID },
            });

            if (!user) {
                return error(404, "User not found");
            }
            const userSkill = await prisma.userSkills.findFirst({
                where: {
                    UserID: userID,
                    Skill_ID: skill.Skill_ID,
                },
            });

            if (!userSkill) {
                return error(404, "User does not have this skill");
            }

            await prisma.userSkills.deleteMany({
                where: {
                    UserID: userID,
                    Skill_ID: skill.Skill_ID,
                },
            });

            return { message: "Skill removed from user" };
        },
        {
            body: t.Object({
                userID: t.String(),
                skillName: t.String(),
            }),
        }
    )