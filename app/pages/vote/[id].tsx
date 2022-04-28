import { useAuth0 } from "@auth0/auth0-react";
import { ConvexProvider } from "convex-dev/react";
import { Id } from "convex-dev/values";
import router, { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useConvex, useMutation, useQuery } from "../../convex/_generated";
import { convex } from "../../src/common";

function NominationList() {
  const router = useRouter();
  const id = router.query.id;
  let listNominations = [];
  if (typeof id == "string") {
    listNominations = useQuery("listNominations", Id.fromString(id)) || [];
  }
  return (
    <div>
      <h1>Nominations</h1>
      <ul>
        {" "}
        {listNominations.map((nomination) => (
          <li>
            {nomination.book} ({nomination.nominator}) with {nomination.votes}{" "}
            votes
          </li>
        ))}
      </ul>
    </div>
  );
}

function NominateBox(props: { userId }) {
  const [nomination, setNomination] = useState("");
  const nominate = useMutation("nominate");

  async function handleNominate(event: FormEvent) {
    event.preventDefault();
    // update client state?
    // search for book (add later)
    // put the book in
    const id = router.query.id;
    if (typeof id == "string") {
      const voteId = Id.fromString(id);
      nominate(voteId, nomination, props.userId);
    }
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

export default function NominatePage() {
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
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser, userId]);
  return (
    <main>
      <NominationList />
      <div>
        What book would you like to nominate?
        <NominateBox userId={userId} />
      </div>
    </main>
  );
}
