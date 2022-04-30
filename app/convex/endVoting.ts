import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { VoteStatus } from "../src/model";

export default mutation(async ({ db }, voteId: Id): Promise<void> => {
    let vote = await db.get(voteId);
    vote.status = VoteStatus.Completed;
    db.update(voteId, vote);
});