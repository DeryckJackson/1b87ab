const router = require("express").Router();
const { parse } = require("dotenv");
const { Op } = require("sequelize");
const { User, Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      recipientHasRead: false
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const { conversationId, messageId, recipientId } = req.body;

    let conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.or]: [userId, recipientId]
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.or]: [userId, recipientId]
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ]
    });

    if (conversation.user1.id !== recipientId && conversation.user2.id !== recipientId) {
      return res.sendStatus(401);
    }

    let readMessageIds = [];

    // Sets messages as read up to recieved messageId
    for (let message of conversation.messages) {
      if (!messageId !== message.id && recipientId === message.senderId
        && !message.recipientHasRead) {
        message.recipientHasRead = true;
        readMessageIds.push(message.id);
      }

      if (messageId === message.id) {
        message.recipientHasRead = true;
        readMessageIds.push(message.id);
        break;
      }
    }

    await Message.update({ recipientHasRead: true }, {
      where: {
        id: {
          [Op.in]: readMessageIds
        }
      }
    });

    const convoJSON = conversation.toJSON();

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;


    res.json(convoJSON);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
