import React, { useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const readMessages = useMemo(() => {
    return messages.filter((msg) => msg.recipientHasRead && msg.senderId === userId);
  }, [messages, userId]);
  const lastMessageReadTime = readMessages[readMessages.length - 1]?.createdAt;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} otherUser={otherUser} text={message.text} createdAt={message.createdAt} lastMessageReadTime={lastMessageReadTime} time={time} />
        ) : (
          <OtherUserBubble key={message.id} message={message} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
