const express = require('express');
const { updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async(req,res,next)=> {
    const {routineActivityId} = req.params
    // const obj = {id:routineActivityId}
    const {count, duration} = req.body
    const user = req.user
    const updatedField = {}
    if (count.length) {
        updatedField.count = count
    }
    if(duration.length) {
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
    const user = req.user
    try {
        const routineActivity = await getRoutineActivityById(routineActivityId)
        console.log(routineActivity.id, "ra")
        console.log(req.user.id)
        if(routineActivity.id !== req.user.id) {
            res.status(403);
      next({
        name: "MissingUserError",
        message: `User ${user.username} is not allowed to delete In the afternoon`
      });
        } else {
            const deleteActivity = await destroyRoutineActivity(routineActivityId)
            console.log(deleteActivity, "da")
            res.send(deleteActivity)
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
module.exports = router;
