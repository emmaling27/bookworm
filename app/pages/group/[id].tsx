import { useAuth0 } from "@auth0/auth0-react";
import { Button, List, ListItem } from "@mui/material";
import { Id } from "convex-dev/values";
import router, { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useConvex, useMutation, useQuery } from "../../convex/_generated";
import { User, Vote, VoteStatus } from "../../src/common";

function StartVoting(props: { vote: Id }) {
  const startVoting = useMutation("startVoting");
  return (
    <Button variant="contained" onClick={() => startVoting(props.vote)}>
      Let's vote!
    </Button>
  );
}

function NominationList(props: { vote: Id }) {
  const listNominations = useQuery("listNominations", props.vote) || [];
  return (
    <div>
      <h3>Nominations</h3>
      <ul>
        {" "}
        {listNominations.map((nomination) => (
          <li key={nomination.book}>
            {nomination.book} ({nomination.nominator}) with {nomination.votes}{" "}
            votes
          </li>
        ))}
      </ul>
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
      <h3>Members</h3>
      <List>
        {props.members.map((m) => {
          return <ListItem>{m.name}</ListItem>;
        })}
      </List>
    </div>
  );
}

function VoteView(props: { vote: Vote; userId: Id }) {
  return (
    <div>
      <h3>Vote Open: {props.vote.name}</h3>
      {props.vote.status == VoteStatus.Nominating ? (
        <div>
          <NominationList vote={props.vote._id} />
          <div>
            What book would you like to nominate?
            <NominateBox userId={props.userId} voteId={props.vote._id} />
          </div>
          <StartVoting vote={props.vote._id} />
        </div>
      ) : (
        <h4>need a voting view</h4>
      )}
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
  };
  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <MemberList members={memberData} />
      {openVote ? (
        <VoteView vote={openVote} userId={props.userId} />
      ) : (
        <OpenVote userId={props.userId} groupId={props.groupId} />
      )}
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
