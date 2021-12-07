import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextBlack: {
    fontSize: 12,
    color: "black",
    letterSpacing: -0.17,
    textDecoration: "bold"
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, unreadMessageCount } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        {unreadMessageCount > 0 ?
          <Typography className={classes.previewTexBlack}>
            {latestMessageText}
          </Typography> :
          <Typography className={classes.previewText}>
            {latestMessageText}
          </Typography>
        }
      </Box>
    </Box>
  );
};

export default ChatContent;
