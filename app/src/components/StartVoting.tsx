import { Button } from "@mui/material";
import { Id } from "convex-dev/values";
import { useMutation } from "../../convex/_generated";
import React from "react";

export function StartVoting(props: { vote: Id }) {
  const startVoting = useMutation("startVoting");
  return (
    <Button variant="contained" onClick={() => startVoting(props.vote)}>
      Let's vote!
    </Button>
  );
}
export function EndVote(props: { voteId: Id }) {
  const endVoting = useMutation("endVoting");
  return (
    <Button variant="contained" onClick={() => endVoting(props.voteId)}>
      End voting
    </Button>
  );
}
