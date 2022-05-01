import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { VoteStatus } from "../src/model";

// Create a new vote.
export default mutation(({ db }, name: string, user: Id, group: Id): Id => {
  const vote = { name, creator: user, group, status: VoteStatus.Nominating, time: Date.now()};
  return db.insert("votes", vote);
});