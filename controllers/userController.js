const User = require('../models/User')
const { ObjectId } = require("mongoose").Types

module.exports = {

    getUsers (req, res) {
        User.find()
            .then(users => res.json(users))
            .catch((err) => { 
                console.log(err)
                res.status(500).json(err)
            })
    },

    getSingleUser (req, res) {
        User.findOne({
            _id: ObjectId(req.params.id)
        })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' })
            }
            else {
                res.json(user)
            }
        })
        .catch((err) => { 
            console.log(err)
            res.status(500).json(err)
        })
    },

    createUser (req, res) {
        User.findOne({
            $or: [{
                username: req.body.username,
            },
            { 
                email: req.body.email,
            }]
        })
        .then(hasUser => {
            if (hasUser) {
                res.status(400).json({ message: 'This user is already registered.' })
            }
            else {
                User.create(req.body)
                    .then(userData => res.json(userData))
                    .catch((err) => { 
                        console.log(err)
                        res.status(500).json(err)
                    })
            }
        })
    },

    updateUser (req, res) {
        User.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    thoughts: req.body.thoughts,
                    friends: req.body.friends
                }
            },
            { runValidators: true, new: true }
        )
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'User not found.' })
            }
            else {
                res.json(user)
            }
        })
        .catch((err) => { 
            console.log(err)
            res.status(500).json(err)
        })
    },

    deleteUser (req, res) {
        User.findOneAndRemove(
            { _id: ObjectId(req.params.id) }
        )
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: 'User not found.' })
            }
            else {
                res.json(data)
            }
        })
        .catch((err) => { 
            console.log(err)
            res.status(500).json(err)
        })
    },

    addFriend (req, res) {
        User.findOne({
            _id: ObjectId(req.params.id),
            friends: { $in: [ObjectId(req.params.friend_id)] }
        })
        .then(hasFriend => {
            if (hasFriend) {
                res.status(400).json({ message: 'User already has this friend.' })
            }
            else {
                User.findOneAndUpdate(
                    { _id: ObjectId(req.params.id) },
                    { $push: { friends: ObjectId(req.params.friend_id) } }
                )
                .then(async data => {
                    if (!data) {
                        res.status(404).json({ message: 'User not found.' })
                    }
                    else {
                        res.json(await User.findOne({ _id: ObjectId(req.params.id) }))
                    }
                })
                .catch((err) => { 
                    console.log(err)
                    res.status(500).json(err)
                })
            }
        })
    },

    deleteFriend (req, res) {
        User.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $pull: { friends: ObjectId(req.params.friend_id) } }
        )
        .then(async data => {
            if (!data) {
                res.status(404).json({ message: 'User not found.' })
            }
            else {
                res.json(await User.findOne({ _id: ObjectId(req.params.id) }))
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
    }
    
}