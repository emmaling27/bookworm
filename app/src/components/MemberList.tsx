import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { User } from "../../src/model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

export function MemberList(props: { members: User[] }) {
  return (
    <div>
      {" "}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Members</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {" "}
          <List>
            {props.members.map((m) => {
              return <ListItem key={m._id.toString()}>{m.name}</ListItem>;
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
