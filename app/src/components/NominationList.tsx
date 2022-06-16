import { List } from "@mui/material";
import { Id } from "convex-dev/values";
import { Nomination, Vote, VoteStatus } from "../model";
import React from "react";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import { useMutation } from "../../convex/_generated";
import DeleteIcon from "@mui/icons-material/Delete";
import { NominationChat } from "./NominationChat";

export function Nomination(props: {
  nomination: Nomination;
  userId: Id;
  voteStatus: VoteStatus;
}) {
  const { nomination, userId, voteStatus } = props;
  const changeVote = useMutation("changeVote");
  const deleteNomination = useMutation("deleteNomination");
  return (
    <ListItem
      key={nomination.book}
      secondaryAction={NominationChat({ nomination, userId })}
    >
      {" "}
      {voteStatus == VoteStatus.Voting || voteStatus == VoteStatus.Completed ? (
        <Typography marginRight="1em">{nomination.votes}</Typography>
      ) : (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteNomination(nomination._id)}
        >
          <DeleteIcon />
        </IconButton>
      )}
      {voteStatus == VoteStatus.Voting ? (
        <FormControlLabel
          key={nomination.book}
          control={<Checkbox />}
          label={nomination.book}
          checked={nomination.yesVote}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            changeVote(nomination._id, event.target.checked, props.userId)
          }
        />
      ) : (
        <Typography marginRight=".5em">{nomination.book}</Typography>
      )}
      ({nomination.nominator})
    </ListItem>
  );
}

export function NominationList(props: {
  nominations: Nomination[];
  vote: Vote;
  userId: Id;
}) {
  return (
    <div>
      <List>
        {" "}
        {props.nominations.map((nomination) => {
          return (
            <Nomination
              key={nomination._id.toString()}
              nomination={nomination}
              userId={props.userId}
              voteStatus={props.vote.status}
            />
          );
        })}
      </List>
    </div>
  );
}
