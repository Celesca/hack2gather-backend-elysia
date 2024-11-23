import { Elysia, t } from "elysia";
import { prisma } from "../prisma"; // Prisma client

export const ratingController = new Elysia({ prefix: "/rating" })