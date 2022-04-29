import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(async ({ db }, member: Id, group: Id): Promise<void> => {
    let groupData = await db.get(group);
    groupData.members.add(member.toString())
    db.update(group, groupData)
});