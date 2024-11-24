import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const personalController = new Elysia({ prefix: "/personal" })