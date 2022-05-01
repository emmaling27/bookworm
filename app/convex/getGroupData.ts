import { query } from "convex-dev/server";
import { Id } from "convex-dev/values";
import { GroupData, User, VoteStatus } from "../src/model";


export default query(async ({db}, groupId: Id): Promise<GroupData> => {
    const group = await db.get(groupId);
    const memberSet = group.members
    let memberData: User[] = [];
    memberSet.forEach(async (m: string) => {
        let member: User = await db.get(Id.fromString(m));
        memberData.push(member);
    });
    const votes = await db.table("votes").filter(q => q.eq(q.field("group"), groupId)).collect();
    const openVotes = votes.filter(v => v.status == VoteStatus.Nominating || v.status == VoteStatus.Voting);
    if (openVotes.length > 1) {
        throw new Error(`Can't have more than one vote open. Open votes are: ${openVotes}`);
    }
    let openVote;
    if (openVotes.length > 0) {
        openVote = openVotes.pop();
    } else {
        openVote = null;
    }
    return { group, memberData, votes, openVote};
});
