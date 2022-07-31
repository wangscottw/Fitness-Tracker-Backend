const e = require('express');
const express = require('express');
const { getAllActivities, createActivity, updateActivity, getActivityById, getPublicRoutinesByActivity} = require('../db');
const router = express.Router();
const {requireUser} = require('./utils');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async(req,res,next) => {
    const {activityId} = req.params
    const obj = {id:activityId}
    // console.log(activityId, "^^^^^^^^^^^^^^")
    try{
        const activity = await getPublicRoutinesByActivity(obj)
        console.log(activity, "****************")
        if(!activity.length) {
            next({
                name: "Activity error",
                message: `Activity ${activityId} not found`,
            })
        }
        else {
            res.send(activity)
        }
    } catch ({
        name,message
    }) {
       next({
        name,message
       }) 
    }

})
        
    
    
// GET /api/activities
router.get('/', async(req,res,next) => {
    
        const activities = await getAllActivities()
        res.send(activities)
})

// POST /api/activities

router.post('/', requireUser, async(req,res,next) => {
const {name,description} = req.body
const postData = {
    name, description
}
 if (name) {
     next({
        name: "Name already exists",
        message: `An activity with name ${name} already exists`,
    })
}
try {
    const activity = await createActivity(postData)
    if (activity){
        res.send({activity})
    } else {
        next({
            name: "Incorrect credientials",
            message: "Trouble fetching activity",
        })
    }
} catch({name, message}) {
    next({name, message})
}
})
//THIS NEEDS WORK, ALMOST DONE BUT GETTING A NOT ERROR


// PATCH /api/activities/:activityId

router.patch("/:activityId", requireUser, async(req,res,next) => {
    const {activityId} = req.params
    const {name, description} = req.params
    const updateFields = {}
    if (name) {
      updateFields.name = name
    } 
    if (description) {
        updateFields.description = description
    }
    try {
        const originalActivity = getActivityById (activityId)
        // console.log(originalActivity, "###############")
        if (originalActivity.name === name) {
            next({
                name: "Name error",
                message: `An activity with name ${originalActivity.name} already exists`,
            })
        }
        if (originalActivity.id === activityId) {
            const updateActivity = await updateActivity(activityId, updateFields)
            res.send ({activity:updateActivity})
        } else {
            next({
                name: "Unauthorized user error",
                message: `Activity ${activityId} not found`,
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})


module.exports = router;
