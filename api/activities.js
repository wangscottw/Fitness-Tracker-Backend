
const express = require('express');
const { getAllActivities, createActivity, updateActivity, getActivityById, getPublicRoutinesByActivity, getActivityByName} = require('../db');
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
const activities = await getAllActivities()

if (activities.name === name) {
    next({
        name: "Name already exists",
        message: `An activity with name ${name} already exists`,
    })
}

const postData = {
    name, description
}

 
try {
    const activity = await createActivity(postData)
    if (activity){
        res.send(activity)
    } else {
        next({
            name: "Incorrect credientials",
            message: `An activity with name ${name} already exists`
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
    const obj = {id:activityId}
    const {name, description} = req.body
    const fields = {}
    if (name) {
      fields.name = name
    } 
    if (description) {
        fields.description = description
    }
    
    
 
    try {
        const activitiesName = await getAllActivities()
    
    for (let i = 0; i < activitiesName.length; i++) {
        let charr = activitiesName[i]
        
        if(charr.name === name) {
            next({
                name: 'already exists',
                message: `An activity with name ${name} already exists`
            })
        }
        else if (charr.id !== activityId) {
            next({
                name:'doesnotexisterror',
                message: `Activity ${activityId} not found`
            })
        } else {
            const activity = updateActivity(obj, fields)
            res.send(activity)
        }
    }
    

     
       
    
    } catch ({name, message}) {
        next({name, message})
    }
})


module.exports = router;
