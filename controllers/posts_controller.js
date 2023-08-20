const Post = require('../models/post');

const Comment = require('../models/comment');

module.exports.create = async function (req, res) {

    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        return res.redirect('back');
    } catch (err) {
        console.log('Error: ', err);
    }
};

module.exports.destroy = async function (req, res) {

    try {

        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {

            await Post.deleteOne(post._id);

            console.log('Post deleted.');

            await Comment.deleteMany({ post: req.params.id });

            console.log('Comments deleted.');

            return res.redirect('back');
        }
        else {

            console.log('User not authorized to delete this post');

            return res.redirect('back');
        }
    } catch (err) {

        console.log('Error: ', err);

        return;
    }
};

