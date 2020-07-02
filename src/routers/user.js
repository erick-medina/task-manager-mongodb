const express = require('express');
const router = new express.Router();
const User = require('../models/user')

// add new user
router.post('/users', async (req, res) => {
    // to make an instance from the User Model
    const user = new User(req.body)

    try {
        await user.save();
        res.status(201).send(user)
    } catch(e) {
        res.status(404).send(e)
    }
})

// read, fetch data
router.get('/users', async (req, res) => { // fetch all items
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/:id', async (req, res) => { // fetch one item
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
})

// update an user
router.patch('/users/:id', async (req, res) => {
    // send 404 when there is a property that doesnt exist
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user);
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router