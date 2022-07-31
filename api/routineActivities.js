const express = require('express');
const { updateRoutineActivity, getRoutineActivityById} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async(req,res,next)=> {
    const {routineActivityId} = req.params
    const {count, duration} = req.body
    const user = req.user
    console.log('user', user)
    const updatedField = {}
    if (count) {
        updatedField.count = count
    }
    if(duration) {
        updatedField.duration = duration
    }
    try {
        const orginalRoutineActivityId = await getRoutineActivityById(routineActivityId)
        if (orginalRoutineActivityId.routineId === req.user.id) {
            const updated = await updateRoutineActivity(routineActivityId, updatedField)
            res.send(updated)
        } else {
            next({
                name: 'UnauthorizedErro',
                message: `User ${user} is not allowed to update In the evening`
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
