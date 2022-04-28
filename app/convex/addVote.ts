import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

// Create a new vote.
export default mutation(({ db }, name: string, user: Id): Id => {
  return db.insert("votes", { name, creator: user});
});