import { Id } from "convex-dev/values";
import { FormEvent, useState } from "react";
import { useMutation } from "../../convex/_generated";
import React from "react";

export function NominateBox(props: { userId: Id; voteId: Id }) {
  const [nomination, setNomination] = useState("");
  const nominate = useMutation("nominate");

  async function handleNominate(event: FormEvent) {
    event.preventDefault();
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
