const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = (req, res) => {

    Post.findById(req.body.post).then((post) => {

        if(post){

            Comment.create({

                content: req.body.content,
                post: req.body.post,
                user: req.user._id                
            }).then( (comment) => {
                
                post.comment.push(comment);
                post.save();
                res.redirect('back');
            }).catch( (err) => {
        
                console.log('Error occured in creating the comment', err);
        
                return res.redirect('back');
            });
        }
        else{

            console.log('Corresponding post not found in DB');

            return res.redirect('back');
        }        
    }).catch((err) => {

        console.log('Error in finding the post in DB',err);

        return res.redirect('back');
    });
};