import { useState, FormEvent, useEffect } from "react";
import { ConvexProvider } from "convex-dev/react";
import { Id } from "convex-dev/values";
import { convex } from "../src/common";
import { useConvex, useMutation, useQuery } from "../convex/_generated";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

toast.configure();

function StartVote(props: { userId: Id }) {
  if (!props.userId) {
    return <div></div>;
  }
  let router = useRouter();
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
      let id = await startVote(newVoteName, user._id);
      let url = `vote/${encodeURIComponent(id.toString())}`;
      router.push(url);
    }
    body = (
      <div>
        <p className="text-center">
          <span className="badge bg-dark">Logged in as {user.name}</span>
        </p>
        <div className="channel-box">
          <form
            onSubmit={handleStartVote}
            className="d-flex justify-content-center"
          >
            <input
              value={newVoteName}
              onChange={(event) => setNewVoteName(event.target.value)}
              className="form-control w-50"
              placeholder="Start a vote..."
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

function ListGroups(props: { userId }) {
  if (!props.userId) {
    return <div></div>;
  }
  const groups = useQuery("listGroups") || [];
  const addGroupMember = useMutation("addGroupMember");
  const removeGroupMember = useMutation("removeGroupMember");
  return (
    <div>
      {groups.map((g) => {
        const inGroup = g.members.has(props.userId.toString());
        return (
          <Card>
            <CardContent>
              {" "}
              <Typography variant="h5" component="div">
                {g.name}
              </Typography>
              <Typography>{g.description}</Typography>
            </CardContent>
            <CardActions>
              {" "}
              <Button
                size="small"
                onClick={() => {
                  if (inGroup) {
                    removeGroupMember(g._id, props.userId);
                  } else {
                    addGroupMember(props.userId, g._id);
                  }
                }}
              >
                {inGroup ? "Leave" : "Join"}
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}

function GroupView(props: { userId }) {
  if (!props.userId) {
    return <div></div>;
  }
  const user = useQuery("getUser", props.userId);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const addGroup = useMutation("addGroup");
  let body;
  if (!user) {
    body = <div>Loading...</div>;
  } else {
    async function handleCreateGroup(event: FormEvent) {
      event.preventDefault();
      addGroup(newGroupName, newGroupDescription, user._id)
        .catch((e) => {
          toast.error(`${e}`);
        })
        .then(() => {
          setNewGroupName("");
          setNewGroupDescription("");
        });
    }
    body = (
      <div>
        <p className="text-center">
          <span className="badge bg-dark">Logged in as {user.name}</span>
        </p>
        <ListGroups userId={props.userId} />
        <div className="channel-box">
          <form
            onSubmit={handleCreateGroup}
            className="d-flex justify-content-center"
          >
            <input
              value={newGroupName}
              onChange={(event) => setNewGroupName(event.target.value)}
              className="form-control w-50"
              placeholder="Name of group"
            />
            <input
              value={newGroupDescription}
              onChange={(event) => setNewGroupDescription(event.target.value)}
              className="form-control w-50"
              placeholder="Describe the group..."
            />
            <input
              type="submit"
              value="Create Group"
              className="ms-2 btn btn-primary"
              disabled={!newGroupName || !newGroupDescription}
            />
          </form>
          <ToastContainer />
        </div>
      </div>
    );
  }
  return body;
}
function App() {
  console.log("rendering app");
  // Check authentication
  // TODO make this a helper since we'll probably need it everywhere
  let { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [userId, setUserId] = useState<Id | null>(null);
  const convex = useConvex();
  const storeUser = useMutation("storeUser");

  useEffect(() => {
    console.log("effect rerunning ", isLoading, isAuthenticated);
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
  return (
    <main className="py-4">
      <h1 className="text-center">Bookworm</h1>
      <GroupView userId={userId} />
      <div className="main-content"></div>
    </main>
  );
}

export default function Home() {
  return (
    <main>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </main>
  );
}
