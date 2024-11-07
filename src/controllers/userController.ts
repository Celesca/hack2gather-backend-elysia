import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const userController = new Elysia({ prefix: "/user" })

  // Create a new user (sign-up)
  .post(
    "/create",
    async ({ body, error }) => {
      const { userID, userName, email, password, workingStyle, profileImage, bio } = body;

      const existingUser = await prisma.user.findUnique({
        where: { UserID: userID },
      });

      if (existingUser) {
        return error(409, "User already exists");
      }

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          UserID: userID,
          UserName: userName,
          Email: email,
          Password: password,
          WorkingStyle: workingStyle,
          ProfileImage: profileImage,
          Bio: bio,
        },
      });

      return newUser; // Return the newly created user
    },
    {
      body: t.Object({
        userID: t.String(),
        userName: t.String(),
        email: t.String(),
        password: t.String(),
        workingStyle: t.String(),
        profileImage: t.String(),
        bio: t.String(),
      }),
    }
  )

  // Get user details by userID
  .get(
    "/:userID",
    async ({ params: { userID }, error }) => {
      // Fetch the user by ID
      const user = await prisma.user.findUnique({
        where: { UserID: userID },
        include: {
          UserSkills: {
            include: {
              Skill: true,
            },
          },
          Notifications: true,
        },
      });

      if (!user) {
        return error(404, "User not found");
      }

      return user; // Return the user with related skills and notifications
    },
    {
      params: t.Object({
        userID: t.String(),
      }),
    }
  )

  // Update user profile
  .put(
    "/:userID/update",
    async ({ params: { userID }, body, error }) => {
      const { userName } = body;

      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { UserID: userID },
      });

      if (!user) {
        return error(404, "User not found");
      }

      // Update the user
      const updatedUser = await prisma.user.update({
        where: { UserID: userID },
        data: {
          UserName: userName,
        },
      });

      return updatedUser; // Return the updated user
    },
    {
      params: t.Object({
        userID: t.String(),
      }),
      body: t.Object({
        userName: t.String(),
      }),
    }
  )

  // Delete user profile
  .delete(
    "/:userID/delete",
    async ({ params: { userID }, error }) => {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { UserID: userID },
      });

      if (!user) {
        return error(404, "User not found");
      }

      // Delete the user
      await prisma.user.delete({
        where: { UserID: userID },
      });

      return { message: "User deleted successfully" };
    },
    {
      params: t.Object({
        userID: t.String(),
      }),
    }
  );