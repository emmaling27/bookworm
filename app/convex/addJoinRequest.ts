import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, user: Id, group: Id): Promise<Id> => {
    return db.insert("join_requests", {user, group})
});