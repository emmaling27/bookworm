import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "../../convex/_generated";
import { toast, ToastContainer } from "react-toastify";
import { ListGroups } from "./ListGroups";
import { Id } from "convex-dev/values";

export function Groups(props: { userId: Id }) {
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
