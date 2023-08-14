const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    content: {

        type: String,
        required: true
    },
    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //include an array of all the comment on this post schema itself
    comment: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;