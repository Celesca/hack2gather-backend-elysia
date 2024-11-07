import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const skillController = new Elysia({ prefix: "/skill" })