const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middlewares/auth');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try{
        await task.save();
        res.status(201).send(task);        
    }catch(e){
        res.status(400).send(e);
    }
});

// GET /tasks?completed=[true/false]
// GET /tasks?limit=&skip=
// GET /tasks?sortBy=[createdAt:desc/createdAt:asc]
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        req.query.sortBy.split(":")[1] === 'desc' ? sort[req.query.sortBy.split(":")[0]] = -1 : sort[req.query.sortBy.split(":")[0]] = 1; 
    }
    try{
        await req.user.populate({
            path: 'userTasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.userTasks);
    }catch(e){
        res.status(500).send(e);
    };
});

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    if (!_id.match(/[0-9a-zA-Z]{24}$/)) {
        return res.sendStatus(400);
    }
    try{
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.sendStatus(404);
        }
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    if (!req.params.id.match(/[0-9a-zA-Z]{24}$/)) {
        return res.sendStatus(400);
    }

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidUpdate) {
        return res.status(400).send({error: 'invalid update'});
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.sendStatus(404);
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.status(200).send(task);

    }catch(e){
        res.status(500).send(e);
    }
});

router.delete('/task/:id', auth, async (req, res) => {
    if (!req.params.id.match(/[0-9a-zA-Z]{24}$/)) {
        return res.sendStatus(400);
    }

    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send({error: 'Task not found'});
        }
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;