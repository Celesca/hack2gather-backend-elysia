import { Elysia, t } from "elysia";

export const swipeController = new Elysia({ prefix: "/swipe" }).get(
  "/:index",
  ({ params: { index } }) => {
    return index;
  },
  {
   params: t.Object({
      index: t.Number()
   })
  }
);
