import { Elysia } from "elysia";
import { swipeController } from "./controllers/swipeController";
import { swagger } from "@elysiajs/swagger";
import { userController } from "./controllers/userController";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(swagger())
  .use(swipeController)
  .use(userController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
