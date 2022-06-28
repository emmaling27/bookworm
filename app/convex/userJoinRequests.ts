import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { JoinRequest } from "../src/model";

// Returns all the groups a given user has a pending join request for
export default query(async ({ db }, userId: Id): Promise<Set<String>> => {
  let joinRequests: JoinRequest[] = await db
    .table("join_requests")
    .filter(q => q.eq(userId, q.field("user")))
    .collect();
    return new Set(joinRequests.map(x => x.group.toString()));
});