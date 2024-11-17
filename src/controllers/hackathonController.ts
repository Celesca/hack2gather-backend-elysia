import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const hackathonController = new Elysia({ prefix: "/hackathon" })