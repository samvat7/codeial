const Post = require('../../../models/post');

const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    
    let post_list = await Post.find({})
    .populate({
        path: 'user',
        select: '-password' // Exclude the password field
    })
    .populate({path: 'comment', populate: {path: 'user', select:'-password'}});

    return res.json(200, {
        message: "List of posts",
        posts: [post_list]
    });
}

module.exports.destroy = async function(req, res){

    try {

        let post = await Post.findById(req.params.id);

        //if (post.user == req.user.id) {

            await Post.deleteOne(post._id);

            await Comment.deleteMany({ post: req.params.id });

            console.log('Comments deleted.');

            return res.json(200, {
                message: "Post and associated comments deleted"
            });
        // }
        // else {

        //     req.flash('error', 'User not authorized to delete this post');

        //     return res.redirect('back');
        // }
    } catch (err) {

        return res.json(500, {

            message: "Internal server error"
        });
    }
}