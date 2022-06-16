import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { JoinRequest } from "../src/model";

export default mutation(async ({ db }, member: Id, group: Id): Promise<void> => {
    let groupData = await db.get(group);
    groupData.members.add(member.toString())
    db.update(group, groupData)
    let joinRequests: JoinRequest[] = await db.table("join_requests").filter(q => q.eq(member, q.field("user"))).filter(q => q.eq(group, q.field("group"))).collect();
    for (const joinRequest of joinRequests) {
        db.delete(joinRequest._id)
    }
});