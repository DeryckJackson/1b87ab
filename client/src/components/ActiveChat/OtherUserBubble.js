import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";
import { putReadMessage } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex"
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  bubble: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "0 10px 10px 10px"
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8
  }
}));

const OtherUserBubble = (props) => {
  const classes = useStyles();
  const { time, otherUser, message, putReadMessage } = props;
  const { id, text, conversationId, recipientHasRead } = message;

  const elementRef = useRef(null);

  // Tracks if chat message is in frame, if it is dispatches action to server to update it as read
  useEffect(() => {
    const node = elementRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !recipientHasRead) {
        const reqBody = {
          messageId: id,
          recipientId: otherUser.id,
          conversationId
        };
        putReadMessage(reqBody);
      }
    },
      // options for IntersectionObserver 
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
      });

    observer.observe(node);

    return () => observer.disconnect();

  }, [elementRef, id, otherUser.id, putReadMessage, recipientHasRead, conversationId]);

  return (
    <Box className={classes.root} ref={elementRef}>
      <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
      <Box>
        <Typography className={classes.usernameDate}>
          {otherUser.username} {time}
        </Typography>
        <Box className={classes.bubble}>
          <Typography className={classes.text}>{text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    putReadMessage: (body) => {
      dispatch(putReadMessage(body));
    }
  };
};

export default connect(null, mapDispatchToProps)(OtherUserBubble);
