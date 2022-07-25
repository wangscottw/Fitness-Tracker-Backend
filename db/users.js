const client = require("./client");
const bcrypt = require('bcrypt')

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  try{
    const {rows: [user]} = await client.query(`
    INSERT INTO users (username, password )
    VALUES($1 , $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, hashedPassword])
    delete user.password
    return user
  } catch (error) {
    console.error('Trouble creating users', error)
  }
  
  }

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)
  if (isValid) {
    const {rows} = await client.query(`
    SELECT (username, password)
    FROM users

    `)
    return rows
  } else{
    
  }

}

async function getUserById(userId) {
try {
  const {rows: [user]} = await client.query(`
  SELECT id, username
  FROM users
  WHERE id=${userId}
  `)

  if (!user) {
    return null
  }
  return user
} catch (error) {
console.error('TROUBLE GETTING USERBYID', error)
}
}

async function getUserByUsername(userName) {
try {
const {rows: user} = await client.query(`
SELECT USERNAME 
FROM users
WHERE 
`)

return user
} catch (error){
console.error('Trouble getting username', error)
}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
