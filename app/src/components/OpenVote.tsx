import { Id } from "convex-dev/values";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "../../convex/_generated";
import React from "react";

export function OpenVote(props: { userId: Id; groupId: Id }) {
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
