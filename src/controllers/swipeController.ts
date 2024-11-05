import Elysia from "elysia";

export const swipeController = new Elysia({ prefix: "/swipe" })
   .get("/", ({}) => {})