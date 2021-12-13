import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ unreadMessageCount }) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: unreadMessageCount > 0 ? "black" : "#9CADC8",
    textDecoration: unreadMessageCount > 0 ? "bold" : "none",
    letterSpacing: -0.17,
  },
}));

const ChatContent = (props) => {
  const { conversation, unreadMessageCount } = props;
  const { latestMessageText, otherUser } = conversation;
  const classes = useStyles(unreadMessageCount);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>

      </Box>
    </Box>
  );
};

export default ChatContent;
