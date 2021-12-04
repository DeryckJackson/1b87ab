const router = require("express").Router();
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");
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
      read: false
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

    const senderId = req.user.id;
    const { recipientId, conversationId, messageId } = req.body;

    let conversation = await Conversation.findOne({
      where: {
        id: conversationId
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] }
      ]
    });

    let readIds = [];

    for (let message of conversation.messages) {
      if (!messageId !== message.id && recipientId === message.senderId) {
        message.read = true;
        readIds.push(message.id);
      }

      if (messageId === message.id) {
        message.read = true;
        readIds.push(message.id);
        break;
      }
    }

    await Message.update({ read: true }, {
      where: {
        id: {
          [Op.in]: readIds
        }
      }
    });

    res.json(conversation.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
