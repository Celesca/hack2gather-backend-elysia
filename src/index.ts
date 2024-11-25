import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { swipeController } from "./controllers/swipeController";
import { userController } from "./controllers/userController";
import { skillController } from "./controllers/skillController";
import { messageController } from "./controllers/messageController";
import { notificationController } from "./controllers/notificationController";
import { hackathonController } from "./controllers/hackathonController";
import { teamController } from "./controllers/teamController";
import { ratingController } from "./controllers/ratingController";
import { personalController } from "./controllers/personalController";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(swagger({ path: '/v2/swagger' }))
  .use(cors({
    origin: "*",
  }))
  .use(swipeController)
  .use(notificationController)
  .use(userController)
  .use(skillController)
  .use(messageController)
  .use(hackathonController)
  .use(teamController)
  .use(ratingController)
  .use(personalController)
  .use(cors({
    origin: "*",
  }))
  .listen(3000)
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
