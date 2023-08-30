const Comment = require('../models/comment');

const Post = require('../models/post');

const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');

const commentEmailWorker = require('../workers/comment_email_worker');

const queue = require('../config/kue');

module.exports.create = async (req, res) => {

    try {

        let post = await Post.findById(req.body.post);

        if (post) {

            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });



            post.comment.push(comment);
            post.save();

            await comment.populate('post');
            comment = await comment.populate('user');

            //commentsMailer.newComment(comment);

            // let job = queue.create('emails', comment).save( function (err) {
            //     if(err){
            //         console.log('Error in sending to the queue: ', err);
            //         return;
            //     }

            //     console.log('Job enqueued', job.id);
            // })

            if (req.xhr) {

                return res.status(200).json({

                    data: {

                        comment: comment,
                        message: "Comment created!"
                    }
                });
            }

            req.flash('success', 'Commented successfuly');
            res.redirect('back');

        }
        else {

            req.flash('error', 'Corresponding post not found in DB');
            return res.redirect('back');
        }

    } catch (err) {

        req.flash('error', err);

        return;
    }
};

module.exports.destroy = async function (req, res) {

    try {

        let comment = await Comment.findById(req.params.id).populate('post');

        if (comment) {

            if (comment.user == req.user.id || comment.post.user == req.user.id) {

                let postId = comment.post;

                await Comment.deleteOne(comment);

                req.flash('success', 'Comment deleted.');

                await Post.findByIdAndUpdate(postId, { $pull: { comment: req.params.id } });

                await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

                if (req.xhr) {

                    return res.status(200).json({

                        data: {

                            comment_id: req.params.id,
                            message: "Comment deleted"
                        }
                    });
                }

                return res.redirect('back');
            }
            else {

                req.flash('error', 'User not authorized to delete this comment');
                return res.redirect('back');
            }
        } else {

            req.flash('error', 'Corresponding comment not found in DB');
            return res.redirect('back');
        }
    } catch (err) {

        req.flash('error', err);

        console.log('Error: ', err);

        return;
    }
};