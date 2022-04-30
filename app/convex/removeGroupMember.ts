import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { Group } from "../src/model";

export default mutation(async ({ db }, group: Id, member: Id): Promise<void> => {
    let groupData = await db.get(group);
    groupData.members.delete(member.toString());
    db.update(group, groupData)
});