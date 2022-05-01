import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { VoteStatus } from "../src/model";

export default mutation(async ({ db }, voteId: Id): Promise<void> => {
    let vote = await db.get(voteId);
    vote.status = VoteStatus.Completed;
    let nominations = await db.table("nominations").filter(q => q.eq(q.field("vote"), voteId)).collect();
    vote.winner = nominations.sort((a, b) => a.votes.size - b.votes.size).pop().book;
    db.update(voteId, vote);
});