import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const skillController = new Elysia({ prefix: "/skill" })

  // Create a new skill
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

  // Add skill to user
  .post(
    "/add-to-user",
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

      const userSkill = await prisma.userSkills.create({
        data: {
          UserID: userID,
          Skill_ID: skill.Skill_ID,
        },
      });

      return userSkill;
    },
    {
        body: t.Object({
            userID: t.String(),
            skillName: t.String(),
        }),
    }
  );