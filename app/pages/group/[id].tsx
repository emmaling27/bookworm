import { useAuth0 } from "@auth0/auth0-react";
import { Id } from "convex-dev/values";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConvex, useMutation } from "../../convex/_generated";
import React from "react";
import { GroupView } from "../../src/components/GroupView";

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
