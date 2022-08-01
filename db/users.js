const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (username, password)
    VALUES($1 , $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
      [username, hashedPassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    console.error("Trouble creating users", error);
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (isValid) {
      delete user.password; //might have to move this
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
  SELECT id, username
  FROM users
  WHERE id=${userId};
  `);

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("TROUBLE GETTING USERBYID", error);
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
SELECT *
FROM users
WHERE username = $1;
`,
      [userName]
    );

    return user;
  } catch (error) {
    console.error("Trouble getting username", error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
