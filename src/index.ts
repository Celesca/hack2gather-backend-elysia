import { Elysia } from "elysia";
import { swipeController } from "./controllers/swipeController";

const app = new Elysia().get("/", () => "Hello Elysia").use(swipeController).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
