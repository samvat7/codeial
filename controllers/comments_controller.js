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

module.exports.destroy = function(req, res){

    Comment.findById(req.params.id).populate('post').then(function(comment){

        if(comment.user == req.user.id || comment.post.user == req.user.id){

            let postId = comment.post;

            Comment.deleteOne(comment).then(()=>{

                console.log('Comment deleted.')
            }).catch(function(err){

                console.log('Error in delete comment from the DB', err);

                return res.redirect('back');
            });

            Post.findByIdAndUpdate(postId, {$pull: {comment: req.params.id}}).then(() => {

                return res.redirect('back');
            }).catch((err) =>{

                console.log('Error in finding/updating post of the deleted comment', err);

                return res.redirect('back');
            });
        }
        else{

            console.log('User not authorized to delete this comment');

            return res.redirect('back');
        }
    }).catch(function(err){

        console.log('Error finding comment in DB', err);

        return res.redirect('back');
    });
};