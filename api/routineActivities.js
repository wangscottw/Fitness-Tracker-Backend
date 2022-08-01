const express = require('express');
const { updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity, canEditRoutineActivity} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async(req,res,next)=> {
    const {routineActivityId} = req.params
    // const obj = {id:routineActivityId}
    const {count, duration} = req.body
    const user = req.user
    const updatedField = {}
    if (count) {
        updatedField.count = count
    }
    if(duration) {
        updatedField.duration = duration
    }
    try {
        const orginalRoutineActivityId = await getRoutineActivityById(routineActivityId)
        console.log(orginalRoutineActivityId, 'id')
        console.log(req.user.id, 'reqid')
        if (orginalRoutineActivityId.id === req.user.id) {
            const updated = await updateRoutineActivity(routineActivityId, updatedField)
            console.log(updated, 'update')
            res.send(updated)
        } else {
            next({
                name: 'UnauthorizedErro',
                message: `User ${user.username} is not allowed to update In the evening`
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async(req,res,next)=> {
    const {routineActivityId} = req.params
    const user = req.authorization
    console.log(user, "!@#!@#!@#")
    try {
        const activity = await getRoutineActivityById(routineActivityId)
        console.log(activity, 'routiness')
        if (canEditRoutineActivity() ) {
            destroyRoutineActivity(routineActivityId)
            res.send(activity)
        } else {
            res.status(403);
            next({
                name: "MissingUserError",
                message: `User ${req.user.username} is not allowed to delete In the afternoon`
              })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
module.exports = router;
