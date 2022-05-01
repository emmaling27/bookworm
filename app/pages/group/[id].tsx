import { useAuth0 } from "@auth0/auth0-react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Id } from "convex-dev/values";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useConvex, useMutation, useQuery } from "../../convex/_generated";
import { Nomination, User, Vote, VoteStatus } from "../../src/model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentIcon from "@mui/icons-material/Comment";
import React from "react";

function StartVoting(props: { vote: Id }) {
  const startVoting = useMutation("startVoting");
  return (
    <Button variant="contained" onClick={() => startVoting(props.vote)}>
      Let's vote!
    </Button>
  );
}
function EndVote(props: { voteId: Id }) {
  const endVoting = useMutation("endVoting");
  return (
    <Button variant="contained" onClick={() => endVoting(props.voteId)}>
      End voting
    </Button>
  );
}

function Nomination(props: { nomination: Nomination; userId: Id }) {
  const { nomination, userId } = props;
  const changeVote = useMutation("changeVote");

  return (
    <ListItem
      key={nomination.book}
      secondaryAction={NominationChat({ nomination, userId })}
    >
      {nomination.book} ({nomination.nominator})
    </ListItem>
  );
}

function NominationChat(props: { nomination: Nomination; userId: Id }) {
  const { nomination, userId } = props;
  // Popover set up
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Chat message queries/mutations
  const nominationMessages =
    useQuery("nominationMessages", nomination._id) || [];
  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation("sendMessage");
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage(nomination._id, newMessageText, userId);
  }

  return (
    <div>
      <IconButton aria-label="comment" onClick={handleClick}>
        <CommentIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>Chat here about this book!</Typography>
        <List>
          {nominationMessages.map((msg) => {
            return (
              <ListItem key={msg._id.toString()}>
                <Typography marginRight="1em">{msg.author}:</Typography>
                <Typography>{msg.body}</Typography>
              </ListItem>
            );
          })}
        </List>
        <TextField
          id="outlined-basic"
          label="Send message"
          variant="outlined"
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Popover>
    </div>
  );
}

function NominationList(props: {
  nominations: Nomination[];
  vote: Vote;
  userId: Id;
}) {
  const changeVote = useMutation("changeVote");
  // If it is a past vote, make it an accordion with the winner visible
  return (
    <div>
      <List>
        {" "}
        {props.nominations.map((nomination) => {
          if (props.vote.status == VoteStatus.Nominating) {
            return <Nomination nomination={nomination} userId={props.userId} />;
          } else if (props.vote.status == VoteStatus.Voting) {
            return (
              <div key={nomination.book}>
                <span>{nomination.votes}</span>
                <FormControlLabel
                  key={nomination.book}
                  control={<Checkbox />}
                  label={nomination.book}
                  checked={nomination.yesVote}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    changeVote(
                      nomination._id,
                      event.target.checked,
                      props.userId
                    )
                  }
                />
              </div>
            );
          } else {
            return (
              <ListItem key={nomination.book} disablePadding>
                <Typography marginRight="1em">{nomination.votes}</Typography>
                <ListItemText primary={nomination.book} />
              </ListItem>
            );
          }
        })}
      </List>
    </div>
  );
}

function NominateBox(props: { userId: Id; voteId: Id }) {
  const [nomination, setNomination] = useState("");
  const nominate = useMutation("nominate");

  async function handleNominate(event: FormEvent) {
    event.preventDefault();
    // update client state?
    // search for book (add later)
    // put the book in
    setNomination("");
    nominate(props.voteId, nomination, props.userId);
  }

  return (
    <div>
      {" "}
      <form onSubmit={handleNominate} className="d-flex justify-content-center">
        <input
          value={nomination}
          onChange={(event) => setNomination(event.target.value)}
          className="form-control w-50"
          placeholder="Nominate a book..."
        />
        <input
          type="submit"
          value="Nominate"
          className="ms-2 btn btn-primary"
          disabled={!nomination}
        />
      </form>
    </div>
  );
}

function MemberList(props: { members: User[] }) {
  return (
    <div>
      {" "}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Members</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {" "}
          <List>
            {props.members.map((m) => {
              return <ListItem key={m._id.toString()}>{m.name}</ListItem>;
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function VoteView(props: { vote: Vote; userId: Id }) {
  const nominations =
    useQuery("listNominations", props.vote._id, props.userId) || [];
  let body;
  if (props.vote.status == VoteStatus.Nominating) {
    body = (
      <div>
        <h4>open for nominations</h4>
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
        <h4>open for voting</h4>
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
    <div>
      <h3>
        {props.vote.name}: {props.vote.winner}
      </h3>
      {body}
    </div>
  );
}

function GroupView(props: { groupId: Id; userId: Id }) {
  const { group, memberData, openVote, votes } = useQuery(
    "getGroupData",
    props.groupId
  ) || {
    group: { name: "", description: "", members: new Set([]) },
    memberData: [],
    openVote: null,
    votes: [],
  };
  votes.sort((a: Vote, b: Vote) => a.dt - b.dt);
  console.log(votes);
  return (
    <div>
      <title>{group.name}</title>
      <Typography variant="h1" gutterBottom>
        {group.name}
      </Typography>
      <Typography paragraph>{group.description}</Typography>
      <MemberList members={memberData} />
      <div>
        {votes.map((v) => (
          <VoteView key={v._id} vote={v} userId={props.userId} />
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

function OpenVote(props: { userId: Id; groupId: Id }) {
  if (!props.userId) {
    return <div></div>;
  }
  const user = useQuery("getUser", props.userId);
  const [newVoteName, setNewVoteName] = useState("");
  const startVote = useMutation("addVote");
  let body;
  if (!user) {
    body = <div>Loading...</div>;
  } else {
    async function handleStartVote(event: FormEvent) {
      event.preventDefault();
      setNewVoteName("");
      await startVote(newVoteName, user._id, props.groupId);
    }
    body = (
      <div>
        <div className="channel-box">
          <form
            onSubmit={handleStartVote}
            className="d-flex justify-content-center"
          >
            <input
              value={newVoteName}
              onChange={(event) => setNewVoteName(event.target.value)}
              className="form-control w-50"
              placeholder="Open a vote..."
            />
            <input
              type="submit"
              value="Start"
              className="ms-2 btn btn-primary"
              disabled={!newVoteName}
            />
          </form>
        </div>
      </div>
    );
  }

  return body;
}
export default function GroupPage() {
  let { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [userId, setUserId] = useState<Id | null>(null);
  const convex = useConvex();
  const storeUser = useMutation("storeUser");

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getIdTokenClaims().then(async (claims) => {
        // Get the raw ID token from the claims.
        let token = claims!.__raw;
        // Pass it to the Convex client.
        convex.setAuth(token);
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        let id = await storeUser();
        setUserId(id);
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      setUserId(null);
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser]);

  const router = useRouter();
  const id = router.query.id;
  if (typeof id == "string") {
    const groupId = Id.fromString(id);
    return (
      <main>
        <GroupView groupId={groupId} userId={userId} />
      </main>
    );
  } else {
    return <main>There was an error</main>;
  }
}
