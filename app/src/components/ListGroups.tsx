import { Id } from "convex-dev/values";
import { useMutation, useQuery } from "../../convex/_generated";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

export function ListGroups(props: { userId: Id }) {
  let router = useRouter();
  if (!props.userId) {
    return <div></div>;
  }
  const groups = useQuery("listGroups") || [];
  const addJoinRequest = useMutation("addJoinRequest");
  const removeGroupMember = useMutation("removeGroupMember");
  return (
    <div>
      {groups.map((g) => {
        const inGroup = g.members.has(props.userId.toString());
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
              <Button
                size="small"
                onClick={() => {
                  if (inGroup) {
                    removeGroupMember(g._id, props.userId);
                  } else {
                    addJoinRequest(props.userId, g._id);
                  }
                }}
              >
                {inGroup ? "Leave" : "Request to Join"}
              </Button>
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
