import { ConvexProvider, Id } from "@convex-dev/react";
import router, { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "../../convex/_generated";
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
          <li>{nomination.book}</li>
        ))}
      </ul>
    </div>
  );
}

function NominateBox() {
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
      nominate(voteId, nomination);
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
  return (
    <main>
      <ConvexProvider client={convex}>
        <NominationList />
        <div>
          What book would you like to nominate?
          <NominateBox />
        </div>
      </ConvexProvider>
    </main>
  );
}
