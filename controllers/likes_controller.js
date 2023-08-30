const Like = require('../models/like');

const Comment = require('../models/comment');

const Post = require('../models/post');

const User = require('../models/user');

module.exports.toggleLike = async function (req, res) {

    try {

        let likeable;
        let deleted = false;

        let user = await User.findById(req.user._id);

        if (req.query.type == 'Post') {

            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else {

            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        // Find the user's like in the likes array
        let LikeIndex = likeable.likes.findIndex(
            like => like.user.equals(req.user._id)
        );

        // If user's like exists in the array
        if (LikeIndex !== -1) {
            
            

            await Like.findByIdAndDelete(likeable.likes[LikeIndex]._id)

            likeable.likes.splice(LikeIndex, 1);
            await likeable.save();

            user.likes.pull(likeable._id); // Remove liked item from user's likes
            await user.save();

            deleted = true;
        } else {
            // Create a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: likeable,
                onModel: req.query.type
            });

            likeable.likes.push(newLike);
            await likeable.save();

            user.likes.push(likeable._id); // Add liked item to user's likes
            await user.save();
        }

        console.log('User: \n', user);

        return res.json(200, {

            message: `${req.query.type} has been liked`,
            data: {

                deleted: deleted,
                number_of_likes: likeable.likes.length,
                likeableID: likeable._id
            }
        })

    } catch (err) {

        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}