const { getActivityById } = require("./activities");
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine]} = await client.query (`
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId,isPublic,name,goal])
    return routine
  } catch (error) {
    console.log('Trouble creating activity', error)
  }
}

async function getRoutineById(routineId) {
  try {
    const {rows: [routine]} = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=${routineId}
    `)
    if (!routine) {
      return null
    }
    return routine
  } catch (error) {
    console.error('Trouble getting routine by id', error)
  }
}

async function getRoutinesWithoutActivities() {

}

async function getAllRoutines() {
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id;
    `)
    return attachActivitiesToRoutines(routines)
  } catch (error) {
    console.error('Trouble getting all routines', error)
  }
}

async function getAllPublicRoutines() {
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
  `) 
  return attachActivitiesToRoutines(routines);} 
  catch (error) {
    console.error('Trouble getting all public routines', error)
    }
  }
async function getAllRoutinesByUser({ username }) {
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE username = $1;
  `, [username])
  
   return attachActivitiesToRoutines(routines)
} catch (error) {
  console.error('Trouble getting All routines ' + error)
}
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true AND username = $1;
  `, [username]) 
  return attachActivitiesToRoutines(routines);} 
  catch (error) {
    console.error('Trouble getting all public routines', error)
    }
  }
async function getPublicRoutinesByActivity({ id }) {
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, activities.name
    FROM routines
    JOIN activities ON routines."creatorId" = activities.id
    WHERE "isPublic" = true;
  `) 
  return attachActivitiesToRoutines(routines);} 
  catch (error) {
    console.error('Trouble getting all public routines', error)
    }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if(setString.length === 0) {
  return;
}
 try {
  const {
    rows: [routine]
  } = await client.query(`
  UPDATE routines
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
  `,
  Object.values(fields));
  return routine;
} catch (error) {
  console.error ('trouble getting update routine', error);
}
}

async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = ${id};
    `)
    
    const {rows: [routine]} = await client.query(`
    DELETE FROM routines
    WHERE id=${id}
    RETURNING *;
    `)

    return routine;
  } 
   catch (error) {
  console.error ('trouble removing routine', error);

   }

  }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
