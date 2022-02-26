const mongoose = require("mongoose");
const moment = require("moment");

const reactionSchema = new mongoose.Schema({

    reactionID: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },

    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },

    username: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate
    }
},
{
    toJSON: {
        getters: true
    },
    _id: false
});

const thoughtSchema = new mongoose.Schema({

    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate
    },

    username: {
        type: String,
        required: true
    },

    reactions: [reactionSchema]

},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

function formatDate(date) {
    let formatted = moment(date);
    return formatted.format("MMM do, YYYY [at] hh[:]ss a");
}

thoughtSchema.virtual('reactionCount')
    .get(function () {
        return this.reactions.length
    });

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;