import { Typography } from "@mui/material";
import { Id } from "convex-dev/values";
import { useQuery } from "../../convex/_generated";
import { User, Vote } from "../model";
import React from "react";
import { OpenVote } from "./OpenVote";
import { MemberList } from "./MemberList";
import { VoteView } from "./VoteView";
import { JoinRequests } from "./JoinRequests";

export function GroupView(props: { groupId: Id; userId: Id }) {
  const { group, memberData, openVote, votes } = useQuery(
    "getGroupData",
    props.groupId
  ) || {
    group: { name: "", description: "", members: new Set([]) },
    memberData: [],
    openVote: null,
    votes: [],
  };
  const joinRequests: User[] =
    useQuery("listJoinRequests", props.groupId) || [];
  console.log({ joinRequests });
  votes.sort((a: Vote, b: Vote) => b.time - a.time);
  return (
    <div>
      <title>{group.name}</title>
      <Typography variant="h1" gutterBottom>
        {group.name}
      </Typography>
      <Typography paragraph>{group.description}</Typography>
      <MemberList members={memberData} />
      <JoinRequests users={joinRequests} groupId={props.groupId} />
      <div>
        {votes.map((v) => (
          <VoteView key={v._id.toString()} vote={v} userId={props.userId} />
        ))}
        {openVote ? (
          <div></div>
        ) : (
          <OpenVote userId={props.userId} groupId={props.groupId} />
        )}
      </div>
    </div>
  );
}
