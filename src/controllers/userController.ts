import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

const ensureUploadDirectory = async () => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
  await mkdir(uploadDir, { recursive: true });
  return uploadDir;
};

export const userController = new Elysia({ prefix: "/user" })

  // Create a new user (sign-up)
  .post(
    "/create",
    async ({ body, error }) => {
      const { userName, email, password, workingStyle, ProfileImage, bio, age, location } = body;

      const existingUser = await prisma.user.findUnique({
        where: { Email: email },
      });

      if (existingUser) {
        return error(409, "User already exists");
      }

      // Generate a unique user ID
      const userID = Math.random().toString(36).substr(2, 9);

      let profileImagePath = null;

      if (ProfileImage) {
        // Remove data URL prefix if exists
        const base64Data = ProfileImage.replace(/^data:image\/\w+;base64,/, '');
        
        // Ensure upload directory exists
        const uploadDir = await ensureUploadDirectory();
        
        // Generate unique filename
        const imageExtension = ProfileImage.split(';')[0].split('/')[1];
        const filename = `${userID}-${uuidv4()}.${imageExtension}`;
        const filepath = path.join(uploadDir, filename);
        
        // Write file
        await writeFile(filepath, base64Data, 'base64');
        
        // Save relative path to store in database
        profileImagePath = `/uploads/profiles/${filename}`;
      }

      const hashPassword = await Bun.password.hash(password);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          UserID: userID,
          UserName: userName,
          Bio: bio,
          Email: email,
          Password: hashPassword,
          ProfileImage: profileImagePath, // Now storing file path
          WorkingStyle: workingStyle,
          Age: age,
          Location: location,
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
        age: t.Optional(t.Number()),
        location: t.Optional(t.String()),
      }),
    }
  )

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
  .get("/id/:UserID", async ({ params: { UserID }, error }) => {
    const user = await prisma.user.findUnique({
      where: { UserID: UserID },
      select: {
        UserID: true,
        UserName: true,
        Email: true,
        WorkingStyle: true,
        ProfileImage: true,
        Bio: true,
        Age: true,
        Location: true,
        AverageRating: true,
      },
    });

    if (!user) {
      return error(404, "User not found");
    }

    return user;
  })

  // Get user details by userID with related skills and notifications
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
      const { userName, email, workingStyle, profileImage, bio, age, location } = body;

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
          Age: age ? Number(age) : user.Age, // Ensure age is converted to number
          Location: location || user.Location,
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
        age: t.Optional(t.String()), // Change to string to match FormData
        location: t.Optional(t.String()),
      }),
    }
  )

  // Get all users 
  .get(
    "/all_users",
    async () => {
      const users = await prisma.user.findMany({
      select: {
        UserID: true,
        UserName: true,
        Email: true,
        WorkingStyle: true,
        Bio: true,
        Age: true,
        Location: true
      }
      });
      return users;
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