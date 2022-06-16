import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { JoinRequest, User } from "../src/model";

export default query(async ({ db }, groupId: Id): Promise<User[]> => {
  let joinRequests: JoinRequest[] = await db
    .table("join_requests")
    .filter(q => q.eq(groupId, q.field("group")))
    .collect();
    return Promise.all(joinRequests.map(async x => await db.get(x.user)));
});