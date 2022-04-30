import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { Nomination } from "../src/model";

// List all nominations for a given vote.
export default query(async ({ db }, vote: Id, userId: Id): Promise<Nomination[]> => {
  const nominations = await db
    .table("nominations")
    .filter(q => q.eq(q.field("vote"), vote))
    .collect();
    return Promise.all(
      nominations.map(async nomination => {
        // Get the nominator name
        const user = await db.get(nomination.user);
        const yesVote = nomination.votes.has(user._id.toString());
        return {
          nominator: user.name,
          yesVote,
          votes: nomination.votes.size,
          _id: nomination._id,
          book: nomination.book
        }
      })
    )
});