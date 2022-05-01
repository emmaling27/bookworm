import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, nomination: Id, body: string, userId: Id) => {
  const message = {
    nomination,
    body,
    time: Date.now(),
    userId,
  };
  db.insert("messages", message);
});
