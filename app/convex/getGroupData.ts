import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { GroupData, User } from "../src/common";


export default query(async ({db}, groupId: Id): Promise<GroupData> => {
    const group = await db.get(groupId);
    const memberSet = group.members
    let memberData = [];
    memberSet.forEach(async (m: string) => {
        let member: User = await db.get(Id.fromString(m));
        memberData.push(member);
    });
    return { group, memberData };
});
