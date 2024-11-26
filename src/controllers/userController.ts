import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const userController = new Elysia({ prefix: "/user" })

  // Create a new user (sign-up)
  .post(
    "/create",
    async ({ body, error }) => {
      const { userName, email, password, workingStyle, ProfileImage, bio } = body;

      const existingUser = await prisma.user.findUnique({
        where: { Email: email },
      });

      if (existingUser) {
        return error(409, "User already exists");
      }

      // Generate a unique user ID
      const userID = Math.random().toString(36).substr(2, 9);

      const hashPassword = await Bun.password.hash(password);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          UserID: userID,
          UserName: userName,
          Bio: bio,
          Email: email,
          Password: hashPassword,
          ProfileImage: ProfileImage, // base64 string
          WorkingStyle: workingStyle,
        },
      });

      return newUser; // Return the newly created user
        },
        {
      body: t.Object({
        userName: t.String(),
        email: t.String(),
        password: t.String(),
        workingStyle: t.Optional(t.String()),
        ProfileImage: t.Optional(t.String()),
        bio: t.Optional(t.String()),
      }),
        })

  
  // User login
.post(
  "/login",
  async ({ body, error }) => {
    const { email, password } = body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { Email: email },
    });

    if (!user) {
      return error(404, "User not found");
    }

    // Verify the password
    const isPasswordValid = await Bun.password.verify(password, user.Password);

    if (!isPasswordValid) {
      return error(401, "Invalid credentials");
    }

    // Return user details or a token
    return { message: "Login successful", user };
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  }
)

// Get user details by userID
.get("/id/:UserID", async ({ params: { UserID  }, error }) => {
  const user = await prisma.user.findUnique({
    where: { UserID: UserID  },
    select: {
      UserID: true, // เพิ่ม UserID เพื่อใช้อ้างอิง
      UserName: true,
      Email: true,
      WorkingStyle: true,
      ProfileImage: true,
      Bio: true,
    },
  });

  if (!user) {
    return error(404, "User not found");
  }

  return user;
})




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
  "/:userID",
  async ({ params: { userID }, body, error }) => {
    const { userName, email, workingStyle, profileImage, bio } = body;

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
        UserName: userName || user.UserName,
        Email: email || user.Email,
        WorkingStyle: workingStyle || user.WorkingStyle,
        ProfileImage: profileImage || user.ProfileImage,
        Bio: bio || user.Bio,
      },
    });

    return updatedUser; // Return the updated user
  },
  {
    params: t.Object({
      userID: t.String(),
    }),
    body: t.Object({
      userName: t.Optional(t.String()),
      email: t.Optional(t.String()),
      workingStyle: t.Optional(t.String()),
      profileImage: t.Optional(t.String()),
      bio: t.Optional(t.String()),
    }),
  }
)

  // Get all users
  .get(
    "/all",
    async () => {
      // Fetch all users
      const users = await prisma.user.findMany({
        include: {
          UserSkills: {
            include: {
              Skill: true,
            },
          },
          Notifications: true,
        },
      });

      return users; // Return all users with related skills and notifications
    })

  // Delete user profile
  .delete(
    "/:userID",
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