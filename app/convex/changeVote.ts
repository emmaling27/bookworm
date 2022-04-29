import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({db}, nominationId: Id, yesVote: boolean, userId: Id): Promise<void> => {
    let nomination = await db.get(nominationId);
    if (yesVote) {
        nomination.votes.add(userId.toString());
    } else {
        nomination.votes.delete(userId.toString());
    }
    db.update(nominationId, nomination);
})