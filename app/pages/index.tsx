import { useState, useEffect } from "react";
import { ConvexProvider } from "convex-dev/react";
import { Id } from "convex-dev/values";
import { convex } from "../src/common";
import { useConvex, useMutation } from "../convex/_generated";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Typography from "@mui/material/Typography";
import { Groups } from "../src/components/Groups";

toast.configure();

function App() {
  // Check authentication
  // TODO make this a helper since we'll probably need it everywhere
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
  return (
    <main className="py-4">
      <Typography variant="h1">Bookworm</Typography>
      <title>Bookworm</title>
      <Groups userId={userId} />
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
