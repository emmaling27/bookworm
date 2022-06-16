import { Typography } from "@mui/material";
import { Id } from "convex-dev/values";
import { useQuery } from "../../convex/_generated";
import { Vote, VoteStatus } from "../../src/model";
import React from "react";
import { StartVoting, EndVote } from "../../src/components/StartVoting";
import { NominationList } from "../../src/components/NominationList";
import { NominateBox } from "./NominateBox";

export function VoteView(props: { vote: Vote; userId: Id }) {
  const nominations =
    useQuery("listNominations", props.vote._id, props.userId) || [];
  let body;
  if (props.vote.status == VoteStatus.Nominating) {
    body = (
      <div>
        <Typography variant="h5">open for nominations</Typography>
        <NominationList
          nominations={nominations}
          vote={props.vote}
          userId={props.userId}
        />
        <div>
          What book would you like to nominate?
          <NominateBox userId={props.userId} voteId={props.vote._id} />
        </div>
        {nominations.length > 0 ? <StartVoting vote={props.vote._id} /> : ""}
      </div>
    );
  } else if (props.vote.status == VoteStatus.Voting) {
    body = (
      <div>
        <Typography variant="h5">open for voting</Typography>
        <NominationList
          nominations={nominations}
          vote={props.vote}
          userId={props.userId}
        />
        {nominations.length > 0 ? <EndVote voteId={props.vote._id} /> : ""}
      </div>
    );
  } else {
    body = (
      <div>
        <NominationList
          nominations={nominations}
          vote={props.vote}
          userId={props.userId}
        />
      </div>
    );
  }
  return (
    <div className="vote-view">
      <Typography variant="h3">
        {props.vote.name}: {props.vote.winner}
      </Typography>
      {body}
    </div>
  );
}
