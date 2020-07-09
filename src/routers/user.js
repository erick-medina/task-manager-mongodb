const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middelware/auth');

// add new user
router.post('/users', async (req, res) => {
    // to make an instance from the User Model
    const user = new User(req.body)

    try {
        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(404).send(e)
    }
})

// logging in users
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken() // referred to the specific user
        res.send({ user, token})
    } catch(e) {
        res.status(400).send()
    }
})

// logging out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// read, fetch data
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
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
        const user = await User.findById(req.params.id);

        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save();

        if (!user) {
            return res.status(404).send()
        }

        res.send(user);
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', auth, async (req, res) => {
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