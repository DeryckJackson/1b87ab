import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((previewText) => ({
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
    color: previewText.color,
    textDecoration: previewText.textDecoration,
    letterSpacing: -0.17,
  },
}));

const previewTextStyle = (unreadMessages) => {
  if (unreadMessages > 0) {
    return {
      color: "black",
      textDecoration: "bold"
    };
  } else {
    return {
      color: "#9CADC8",
      textDecoration: "none"
    };
  }
};

const ChatContent = (props) => {
  const { conversation, unreadMessageCount } = props;
  const { latestMessageText, otherUser } = conversation;
  const classes = useStyles(previewTextStyle(unreadMessageCount));

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewTexBlack}>
          {latestMessageText}
        </Typography>

      </Box>
    </Box>
  );
};

export default ChatContent;
