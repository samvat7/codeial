const Post = require('../models/post');

const Comment = require('../models/comment');

const Like = require('../models/like');

module.exports.create = async function (req, res) {

    try {

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        await post.populate('user');

        if (req.xhr) {

            return res.status(200).json({

                data: {
                    post: post,
                    message: "Post created!"
                }
            });
        }

        req.flash('success', 'Post created successfuly');

        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
    }
};

module.exports.destroy = async function (req, res) {

    try {

        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            
            try {
                // Delete likes associated with the post
                await Like.deleteMany({ likeable: post, onModel: 'Post' });
            
                // Delete likes associated with the comments on the post
                await Like.deleteMany({ likeable: { $in: post.comments }, onModel: 'Comment' });
            
                // Rest of your code...
            } catch (error) {
                console.error(error);
                // Handle the error, maybe by sending an appropriate error response
            }

            await Post.deleteOne(post._id);

            if (req.xhr) {

                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted!"
                })
            }

            req.flash('success', 'Post deleted.');

            await Comment.deleteMany({ post: req.params.id });

            console.log('Comments deleted.');

            return res.redirect('back');
        }
        else {

            req.flash('error', 'User not authorized to delete this post');

            return res.redirect('back');
        }
    } catch (err) {

        req.flash('error', err);

        return;
    }
};

