const Post = require('../models/post');

const User = require('../models/user');

const Friendship = require('../models/friendships');

const env = require('../config/environment');



module.exports.home = async function (req, res) {

    try {
        //populating the posts array's user attribute

        let post_list = await Post.find({})
            .populate('user')
            .populate({ path: 'comment', populate: { path: 'user' } })

        let users = await User.find({})
        

        //console.log(users);

        if (req.user) {

            let friendships = await Friendship.find({
                $or: [
                    { from_user: req.user.id },
                    { to_user: req.user.id }
                ]
            });
    
            let friends = [];
    
            friendships.forEach(friendship => {
                if (friendship.from_user.equals(req.user.id)) {
                    friends.push(friendship.to_user.toString());
                } else {
                    friends.push(friendship.from_user.toString());
                }
            });
    
            console.log(friends);

            let currentUser = await User.findById(req.user.id).populate('friendships');

            //console.log(currentUser);

            return res.render('home', {
                title: "Codeial | Home",
                posts: post_list,
                user_list: users,
                user_likes: req.user.likes,
                friends: currentUser.friendships,
                friends_id_list: friends
            });
        }
        else {

            return res.render('home', {
                title: "Codeial | Home",
                posts: post_list,
                user_list: users
            });
        }

    } catch (err) {

        req.flash('error', err);

        return;
    }
};
