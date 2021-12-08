import React, { useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    },
  },
  unreadMessageNumber: {
    marginLeft: "auto",
    marginRight: 5,
    backgroundColor: "rgb(63,146,255)",
    color: "white",
    fontSize: "14px",
    lineHeight: "24px",
    height: "24px",
    width: "24px",
    borderRadius: "50%",
    textAlign: "center",
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser, messages } = conversation;

  const unreadMessageCount = useMemo(() => {
    return messages.filter(msg => msg.senderId === otherUser.id && !msg.recipientHasRead).length;
  }, [messages, otherUser.id]);

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unreadMessageCount={unreadMessageCount} />
      {unreadMessageCount > 0 &&
        <Typography className={classes.unreadMessageNumber}>
          {unreadMessageCount}
        </Typography>
      }
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
