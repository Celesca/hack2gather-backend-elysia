import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swipeController } from "./controllers/swipeController";
import { userController } from "./controllers/userController";
import { skillController } from "./controllers/skillController";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(swagger())
  .use(swipeController)
  .use(userController)
  .use(skillController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
