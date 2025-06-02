const cookie = require('cookie');
module.exports = (req, res) => {
  res.status(200).json({ message: "OAuth callback placeholder using cookie" });
};