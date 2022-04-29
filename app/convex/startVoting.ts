import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { VoteStatus } from "../src/common";

export default mutation(async ({ db }, voteId: Id): Promise<void> => {
    let vote = await db.get(voteId);
    vote.status = VoteStatus.Voting;
    db.replace(voteId, vote);
});