const Post = require('../models/post');

const User = require('../models/user');

module.exports.home = function(req, res){

    console.log(req.cookies);

    //populating the posts array's user attribute

    Post.find({})
    .populate('user')
    .populate({path: 'comment', populate: {path: 'user'}})
    .then((post_list) => {

        console.log('Retrived posts list from DB');

        User.find({}).then((users) => {

            for(u of users){

                console.log(u);
            }
            

            return res.render('home', {
                title: "Codeial | Home",
                posts: post_list,
                user_list: users
            });
        }).catch((err) => {

            console.log('Error in retrieving user list from DB', err);

            return res.redirect('back');
        })
    }).catch((err) => {

        console.log('Error retriving posts from DB', err);

        res.redirect('back');
    });

};
