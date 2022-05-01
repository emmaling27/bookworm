import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { Message } from "../src/model";

// List all messages for the given nomination
export default query(async ({ db }, nomination: Id): Promise<Message[]> => {
  const messages = await db
    .table("messages")
    .filter(q => q.eq(q.field("nomination"), nomination))
    .collect();
  return Promise.all(
    messages.map(async message => {
      // For each message in this channel, fetch the `User` who wrote it and
      // insert their name into the `author` field.
      if (message.userId) {
        const user = await db.get(message.userId);
        return {
          author: user.name,
          ...message,
        };
      } else {
        return message;
      }
    })
  );
});
