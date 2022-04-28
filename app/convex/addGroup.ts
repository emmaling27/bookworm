import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, name: string, description: String, creator: Id): Promise<Id> => {
    const groups_with_same_name = await db.table("groups").filter(q => q.eq(name, q.field("name"))).collect();
    if (groups_with_same_name.length != 0) {
        throw new Error(`Group name was not unique. The group ${name} already exists.`)
    }
    return db.insert("groups", { name, description, members: [creator], creator});
});