import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swipeController } from "./controllers/swipeController";
import { userController } from "./controllers/userController";
import { skillController } from "./controllers/skillController";
import { messageController } from "./controllers/messageController";
import { notificationController } from "./controllers/notificationController";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(swagger())
  .use(swipeController)
  .use(notificationController)
  .use(userController)
  .use(skillController)
  .use(messageController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
