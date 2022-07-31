const express = require('express');
const { getAllRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine } = require('../db/routines');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/routines
router.get('/', async (req,res,next)=> {
    const routine = await getAllRoutines()

    res.send(routine)
})
// POST /api/routines
router.post('/', requireUser, async (req,res,next)=> {
    const {creatorId,  isPublic, name, goal} = req.body
    const routineData = {
        creatorId: req.user.id,
        isPublic,
        name, 
        goal
    }

    try {
        const routine = await createRoutine(routineData)
        if (routine){
            res.send(routine)
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'troubling creating routine'
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async(req,res,next)=> {
    const {routineId} = req.params
    const {isPublic, name, goal } = req.body
    const obj = {
        id: routineId
    }
    const updatedRoutine = {}
    if (isPublic) {
        updatedRoutine.isPublic = isPublic
    }
    if(name) {
        updatedRoutine.name = name
    }
    if(goal) {
        updatedRoutine.goal = goal
    }

    try {
        const originalRoutine = await getRoutineById(routineId)
        console.log(originalRoutine, 'OR')
        if (originalRoutine.creatorId === req.user.id) {
            const newRoutine = await updateRoutine(obj, updatedRoutine)
            console.log(updatedRoutine, "NR")
            res.send(newRoutine)
        } else {
            res.status(403);
            next({
                name: "MissingUserError",
                message: `User ${req.user.username} is not allowed to update Every day`
              })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async(req,res,next)=> {
    const {routineId} = req.params
    const obj = {id:routineId}
    try {
        const routine = await getRoutineById(routineId)
        console.log(routine, 'routiness')
        if (routine && routine.creatorId === req.user.id) {
            const deleteRoutine = destroyRoutine(obj)
            res.send(deleteRoutine)
        } else {
            res.status(403);
            next({
                name: "MissingUserError",
                message: `User ${req.user.username} is not allowed to delete On even days`
              })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async(req,res,next)=> {
    
})
module.exports = router;
