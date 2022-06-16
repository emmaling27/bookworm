import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { User } from "../../src/model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useMutation } from "../../convex/_generated";
import { Id } from "convex-dev/values";

export function JoinRequests(props: { users: User[]; groupId: Id }) {
  const addGroupMember = useMutation("addGroupMember");

  return (
    <div>
      {" "}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Requests to Join</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {" "}
          <List>
            {props.users.map((m) => {
              return (
                <ListItem key={m._id.toString()}>
                  {m.name}
                  <IconButton
                    edge="end"
                    aria-label="add"
                    onClick={() => addGroupMember(m._id, props.groupId,)}
                  >
                    <AddIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
