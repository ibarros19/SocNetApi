const { User, Thought } = require('../models')
const { ObjectId } = require("mongoose").Types

module.exports = {

    getThoughts (req, res) {
        Thought.find()
            .then(data => res.json(data))
            .catch(err => res.status(500).json(err))
    },

    getSingleThought (req, res) {
        Thought.findOne({
            _id: ObjectId(req.params.id)
        })
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'Thought not found.' })
            }
            else {
                res.json(thought)
            }
        })
    },

    createThought (req, res) {
        Thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username
        })
        .then(data => {
            res.json(data)
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json(err)
        })
    },

    updateThought (req, res) {
        Thought.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                    thoughtText: req.body.thoughtText,
                    username: req.body.username,
                    reactions: req.body.reactions
                }
            },
            { runValidators: true, new: true }
        )
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'Thought not found.' })
            }
            else {
                res.json(data)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    deleteThought (req, res) {
        Thought.findOneAndRemove(
            { _id: ObjectId(req.params.id) }
        )
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'Thought not found.' })
            }
            else {
                res.json(data)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    addReaction (req, res) {
        const reaction = {
            reactionBody: req.body.reactionBody,
            username: req.body.username
        }
        Thought.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $push: { reactions: reaction } }
        )
        .then(async data => {
            if (!data) {
                res.status(404).json({ message: 'Thought not found.' })
            }
            else {
                res.json(await Thought.findOne({ _id: ObjectId(req.params.id) }))
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    deleteReaction (req, res) {
        Thought.findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $pull: { reactions: { reactionID: req.params.reaction_id } } }
        )
        .then(async data => {
            if (!data) {
                res.status(404).json({ message: 'Thought not found.' })
            }
            else {
                res.json(await Thought.findOne({ _id: ObjectId(req.params.id) }))
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }

}