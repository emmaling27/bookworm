import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { Nomination } from "../src/common";

// List all nominations for a given vote.
export default query(async ({ db }, vote: Id): Promise<Nomination[]> => {
  const nominations = await db
    .table("nominations")
    .filter(q => q.eq(q.field("vote"), vote))
    .collect();
    return Promise.all(
      nominations.map(async nomination => {
        // Get the nominator name
        if (nomination.user) {
          const user = await db.get(nomination.user);
          return {
            nominator: user.name,
            ...nomination 
          }
        } else {
          return {
            nominator: "unknown",
            ...nomination
          }
        }
      })
    )
});