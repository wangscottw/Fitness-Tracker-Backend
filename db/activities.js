const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {rows : [activity]} = await client.query (`
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    ON CONFLICT (activity) DO NOTHING
    RETURNING *;
    `, [name, description])
    return activity
  } catch (error) {
    console.log('Trouble creating activity', error)
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
