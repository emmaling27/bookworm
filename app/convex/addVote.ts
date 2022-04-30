import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { VoteStatus } from "../src/model";

// Create a new vote.
export default mutation(({ db }, name: string, user: Id, group: Id): Id => {
  return db.insert("votes", { name, creator: user, group, status: VoteStatus.Nominating, dt: Date()});
});