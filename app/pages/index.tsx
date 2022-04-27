import { useState, FormEvent, useEffect } from "react";
import { ConvexProvider } from "convex-dev/react";
import { Id } from "convex-dev/values";
import { Message, convex } from "../src/common";
import { useConvex, useMutation, useQuery } from "../convex/_generated";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginLogout } from "./_app";
const randomName = "User " + Math.floor(Math.random() * 10000);

// Render a chat message.
function MessageView(props: { message: Message }) {
  const message = props.message;
  return (
    <div>
      <strong>{message.author}:</strong> {message.body}
    </div>
  );
}

function ChatBox(props: { channelId: Id }) {
  // Dynamically update `messages` in response to the output of
  // `listMessages.ts`.
  const messages = useQuery("listMessages", props.channelId) || [];
  const sendMessage = useMutation("sendMessage");

  // Run `sendMessage.ts` as a mutation to record a chat message when
  // `handleSendMessage` triggered.
  const [newMessageText, setNewMessageText] = useState("");
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    setNewMessageText(""); // reset text entry box
    await sendMessage(props.channelId, newMessageText, randomName);
  }

  return (
    <div className="chat-box">
      <ul className="list-group shadow-sm my-3">
        {messages.slice(-10).map((message: any) => (
          <li
            key={message._id}
            className="list-group-item d-flex justify-content-between"
          >
            <MessageView message={message} />
            <div className="ml-auto text-secondary text-nowrap">
              {new Date(message.time).toLocaleTimeString()}
            </div>
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleSendMessage}
        className="d-flex justify-content-center"
      >
        <input
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
          className="form-control w-50"
          placeholder="Write a message…"
        />
        <input
          type="submit"
          value="Send"
          disabled={!newMessageText}
          className="ms-2 btn btn-primary"
        />
      </form>
    </div>
  );
}
function App() {
  // Check authentication
  // TODO make this a helper since we'll probably need it everywhere
  let { isAuthenticated, isLoading, getIdTokenClaims, loginWithRedirect } =
    useAuth0();
  const [userId, setUserId] = useState<Id | null>(null);
  const [userName, setUserName] = useState<String | null>(null);
  const convex = useConvex();
  const storeUser = useMutation("storeUser");
  const user = useQuery("getUser", userId);
  // Pass the ID token to the Convex client when logged in, and clear it when logged out.
  // After setting the ID token, call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.

  let router = useRouter();
  // Dynamically update `channels` in response to the output of
  // `listChannels.ts`.
  const channels = useQuery("listChannels") || [];

  // Records the Convex document ID for the currently selected channel.
  const [channelId, setChannelId] = useState<Id>();

  // Run `addVote.ts` as a mutation to create a new channel when
  // `handleAddVote` is triggered.

  const [newVoteName, setNewVoteName] = useState("");

  const startVote = useMutation("addVote");
  async function handleStartVote(event: FormEvent) {
    event.preventDefault();
    setNewVoteName("");
    let id = await startVote(newVoteName);
    let url = `vote/${encodeURIComponent(id.toString())}`;
    router.push(url);
  }
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
        setUserName(user.name);
        console.log("we are authenticated");
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      setUserId(null);
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser]);
  if (!isAuthenticated || isLoading) {
    return LoginLogout();
  } else if (isAuthenticated) {
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
      console.log("we are authenticated as ", id);
    });
  } else {
    // Tell the Convex client to clear all authentication state.
    convex.clearAuth();
    setUserId(null);
    return LoginLogout();
  }

  return (
    <main className="py-4">
      <h1 className="text-center">Convex Chat</h1>
      <p className="text-center">
        <span className="badge bg-dark">Logged in as {userName}</span>
      </p>
      <div className="main-content">
        <div className="channel-box">
          <div className="list-group shadow-sm my-3">
            {channels.map((channel: any) => (
              <a
                key={channel._id}
                className="list-group-item channel-item d-flex justify-content-between"
                style={{
                  display: "block",
                  fontWeight: channel._id.equals(channelId) ? "bold" : "normal",
                }}
                onClick={() => setChannelId(channel._id)}
              >
                {channel.name}
              </a>
            ))}
          </div>

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
        {channelId ? <ChatBox channelId={channelId} /> : null}
      </div>
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
