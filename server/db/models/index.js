const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUser = require("./groupUser");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Message.belongsTo(Group);
Group.hasMany(Message);
User.hasMany(GroupUser);
Group.hasMany(GroupUser);
GroupUser.belongsTo(User);
GroupUser.belongsTo(Group);
Group.belongsTo(User, {
  foreignKey: "ownerId"
});

module.exports = {
  User,
  Conversation,
  Message,
  Group,
  GroupUser
};
