const Log = require("../models/Log.model");

module.exports = async (userId, action, ip) => {
  try {
    await Log.create({ userId, action, ip });
  } catch (err) {
    console.error("Logging failed");
  }
};
