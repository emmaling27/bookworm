import {
  Button,
  IconButton,
  List,
  ListItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Id } from "convex-dev/values";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "../../convex/_generated";
import { Nomination } from "../../src/model";
import CommentIcon from "@mui/icons-material/Comment";
import React from "react";

export function NominationChat(props: { nomination: Nomination; userId: Id }) {
  const { nomination, userId } = props;
  // Popover set up
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Chat message queries/mutations
  const nominationMessages =
    useQuery("nominationMessages", nomination._id) || [];
  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation("sendMessage");
  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage(nomination._id, newMessageText, userId);
  }

  return (
    <div>
      <IconButton aria-label="comment" onClick={handleClick}>
        <CommentIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          Chat here about {nomination.book}!
        </Typography>
        <List>
          {nominationMessages.map((msg) => {
            return (
              <ListItem key={msg._id.toString()}>
                <Typography marginRight="1em">{msg.author}:</Typography>
                <Typography>{msg.body}</Typography>
              </ListItem>
            );
          })}
        </List>
        <TextField
          id="outlined-basic"
          label="Send message"
          variant="outlined"
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Popover>
    </div>
  );
}
