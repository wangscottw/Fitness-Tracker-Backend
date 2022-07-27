const client = require("./client");

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
    const {rows: routineId} = await client.query(`
    SELECT id
    FROM routines
    `)
    const routines = await Promise.all(routineId.map(routine => {getRoutineById(routine.id)}))
    return routines
  } catch (error) {
    console.error('Trouble getting all routines', error)
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
