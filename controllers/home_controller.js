const Post = require('../models/post');

module.exports.home = function(req, res){

    console.log(req.cookies);

    //populating the posts array's user attribute

    Post.find({})
    .populate('user')
    .populate({path: 'comment', populate: {path: 'user'}})
    .then((post_list) => {

        console.log('Retrived posts list from DB');

        return res.render('home', {
            title: "Codeial | Home",
            posts: post_list
        });
    }).catch((err) => {

        console.log('Error retriving posts from DB', err);

        res.redirect('back');
    });

};
