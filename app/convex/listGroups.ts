import { query } from "convex-dev/server";
import { Group } from "../src/common";

export default query(async ({ db }): Promise<Group[]> => {
  return await db
    .table("groups")
    .collect();
});