const Post = require('../models/post');

const User = require('../models/user');

module.exports.home = async function(req, res){
    
    try{   
    //populating the posts array's user attribute

    let post_list = await Post.find({})
    .populate('user')
    .populate({path: 'comment', populate: {path: 'user'}});


    let users = await User.find({});
        
    return res.render('home', {
        title: "Codeial | Home",
        posts: post_list,
        user_list: users
    });

    }catch(err){

        req.flash('error', err);

        return;
    }
};
