const Post = require('../models/post');

const Comment = require('../models/comment');

module.exports.create = function(req,res){  

    Post.create({
        content: req.body.content,
        user: req.user._id
    }).then(function(post){

        return res.redirect('back');
    }).catch(function(err){

        console.log('Error in creating a post'); 
        return;
    });
};

module.exports.destroy = function(req,res){

    Post.findById(req.params.id).then(function(post){

        console.log(req.params.id);

        if(post.user == req.user.id){

            Post.deleteOne(post._id).then(() => {

                console.log('Post deleted.');
            }).catch(function(err){

                console.log('Error deleting post from DB', err);

                return res.redirect('back');
            });

            Comment.deleteMany({post:req.params.id}).then(() => {

                console.log('Comments deleted.');
            }).catch((err) => {

                console.log('Error deleting the post', err);
            });

            return res.redirect('back');
        }
        else{

            console.log('User not authorized to delete this post');

            return res.redirect('back');
        }


    }).catch(function(err){

        console.log('Error finding post in DB', err);

        return res.redirect('back');
    });
};

