import { Id } from "convex-dev/values";
import { useMutation, useQuery } from "../../convex/_generated";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

function JoinOrLeaveButton(props: {
  groupId: Id;
  userId: Id;
  inGroup: boolean;
  requestPending: boolean;
}) {
  const addJoinRequest = useMutation("addJoinRequest");
  const removeGroupMember = useMutation("removeGroupMember");
  let buttonText;
  if (props.inGroup) {
    buttonText = "Leave";
  } else if (props.requestPending) {
    console.log("there's a request pending for ", props.groupId);

    buttonText = "Request pending";
  } else {
    buttonText = "Request to join";
  }
  return (
    <Button
      size="small"
      onClick={() => {
        if (props.inGroup) {
          removeGroupMember(props.groupId, props.userId);
        } else if (!props.requestPending) {
          addJoinRequest(props.userId, props.groupId);
        }
      }}
      disabled={props.requestPending}
    >
      {buttonText}
    </Button>
  );
}

export function ListGroups(props: { userId: Id }) {
  let router = useRouter();
  if (!props.userId) {
    return <div></div>;
  }
  const groups = useQuery("listGroups") || [];
  const requestPendingGroups =
    useQuery("userJoinRequests", props.userId) || new Set();
  console.log(requestPendingGroups);
  return (
    <div>
      {groups.map((g) => {
        const inGroup = g.members.has(props.userId.toString());
        const requestPending = requestPendingGroups.has(g._id.toString());
        return (
          <Card key={g.name}>
            <CardContent>
              {" "}
              <Typography variant="h5" component="div">
                {g.name}
              </Typography>
              <Typography>{g.description}</Typography>
            </CardContent>
            <CardActions>
              {" "}
              <JoinOrLeaveButton
                groupId={g._id}
                userId={props.userId}
                inGroup={inGroup}
                requestPending={requestPending}
              />
              <Button
                size="small"
                onClick={() => {
                  let url = `group/${encodeURIComponent(g._id.toString())}`;
                  router.push(url);
                }}
                disabled={!inGroup}
              >
                View
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}
