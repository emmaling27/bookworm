import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { User } from "../src/common";


export default query(async ({db}, user: Id): Promise<User> => {
    return await db.get(user)
});
