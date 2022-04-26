import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { Message } from "../src/common";

// List all nominations for a given vote.
export default query(async ({ db }, vote: Id): Promise<Message[]> => {
  return await db
    .table("nominations")
    .filter(q => q.eq(q.field("vote"), vote))
    .collect();
});