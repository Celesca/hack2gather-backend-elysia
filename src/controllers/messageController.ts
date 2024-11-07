import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const messageController = new Elysia({ prefix: "/message" })