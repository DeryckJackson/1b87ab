const Sequelize = require("sequelize");
const db = require("../db");

const GroupUser = db.define("groupUser", {
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = GroupUser;
