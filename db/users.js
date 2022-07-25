const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  }

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
