const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {rows: [activity]} = await client.query (`
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `, [name, description])
    return activity
  } catch (error) {
    console.log('Trouble creating activity', error)
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const {rows: activityId} = await client.query(`
    SELECT id
    FROM activities
    `)

    const activities = await Promise.all(activityId.map(activity=> getActivityById(activity.id)))

    return activities

  } catch (error){
console.error
  }
}

async function getActivityById(activityId) {
  try {
    const {rows: [activity]} = await client.query(`
    SELECT *
    FROM activities
    WHERE id=${activityId}
    `)
    if(!activity) {
      return null
    } 
    return activity
  } catch (error) {
    console.error("Trouble getting activity by id", error)
  }
}

async function getActivityByName(name) {
  try {
    const {rows: [activity]} = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1
    `,[name])

    return activity
  } catch (error) {
    console.error('Trouble getting activity by name', error) 
  }
}

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    console.error(error)
  }
}

async function updateActivity({ activityId, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key,index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if(setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [activity]
    } = await client.query(`
    UPDATE activties
    SET ${setString}
    WHERE id=${activityId}
    RETURNING *
    `,
   Object.values(fields));
   return activity;
  } catch (error) {
    console.error
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
