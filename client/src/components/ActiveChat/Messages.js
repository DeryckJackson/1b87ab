import React from "react";
import { Avatar, Box, makeStyles } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex"
  },
  avatar: {
    height: 20,
    width: 20,
    marginLeft: "auto",
    marginTop: 6
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;
  const readMessages = messages.filter((msg) => msg.recipientHasRead && msg.senderId === userId);

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {message.createdAt === readMessages[readMessages.length - 1]?.createdAt &&
              <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
            }
          </>
        ) : (
          <OtherUserBubble key={message.id} message={message} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
