import { query } from "convex-dev/server";
import { Group } from "../src/model";

export default query(async ({ db }): Promise<Group[]> => {
  return await db
    .table("groups")
    .collect();
});