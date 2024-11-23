import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const userController = new Elysia({ prefix: "/rating" })