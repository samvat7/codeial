const passport = require('passport');
const User = require('../models/user');
const resetToken = require('../models/resetToken');
const fs = require('fs');
const path = require('path');
const queue = require('../config/kue');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const Friendship = require('../models/friendships');


module.exports.users = async function (req, res) {

    try {

        let user_list = await User.find({});

        console.log('Successfuly retrieved user list.');

        res.locals.users = user_list;

        console.log(req.body);

        return res.render('users', {

            title: "Codeial | Users"
        });
    } catch (err) {

        req.flash('error', err);

        return;
    }
}

module.exports.profile = async function (req, res) {

    try {
        let user = await User.findById(req.params.id);

        res.render('user_profile_logged', {
            title: `${user.name}'s Profile`, // res.locals.user passed on by passport local
            profile_user: user
        });
    } catch (err) {

        req.flash('error', err);

        return;
    }
};

module.exports.update = async function (req, res) {

    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, function (err) {

                if (err) {

                    console.log('Error (Multer): ', err);
                }

                user.name = req.body.name;

                user.email = req.body.email;

                if (req.file) {
                    // Check if the uploaded file has a valid type
                    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (allowedMimeTypes.includes(req.file.mimetype)) {
                        if (user.avatar) {
                            // Check if the avatar file exists in the directory before deleting
                            if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                                fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                            }
                        }
                        // This is saving the path of the uploaded avatar into the avatar field of the user
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    } else {
                        // Handle invalid file type
                        console.log('Invalid file type');
                    }
                }

                user.save();

                return res.redirect('back');
            });

        } catch (err) {

            req.flash('Error: ', err);

            return res.redirect('back');
        }

    }
    else {

        req.flash('error', 'You are NOT Authorized for this operation');

        return res.status(401).send('Unauthorized');
    }

};

module.exports.posts = function (req, res) {

    res.end(`<h1>User's Posts</h1>`);
}

module.exports.register = function (req, res) {

    return res.render('register', {

        title: "Codeial | Register"
    });
};

module.exports.login = function (req, res) {

    return res.render('login', {
        title: "Codeial | Log In"
    });
};

//get the registeration data
module.exports.create = async function (req, res) {

    try {

        if (req.body.password != req.body.confirmpassword) {

            req.flash('err', `Passwords don't match`);
            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);

            req.flash('success', 'Registered successfuly');

            return res.redirect('/users/login');

        } else {

            req.flash('error', 'User with this email already exists');

            res.redirect('back');
        }

    } catch (err) {

        req.flash('error', err);

        return;
    }
};

module.exports.logout = function (req, res) {

    req.logout(function (err) {
        if (err) {

            req.flash('error', err);
            return res.redirect('/');
        }

        req.flash('success', 'Logged out successfuly');
        // Redirect to the home page or any other page you want after successful logout
        return res.redirect('/');
    });
};

module.exports.createSession = function (req, res) {

    req.flash('success', 'Logged in successfuly');

    return res.redirect('/');
}

module.exports.forgotPassword = function (req, res) {

    return res.render('forgot_password', {
        title: "Codeial | Forgot Password"
    });
}

module.exports.sendEmail = async function (req, res) {

    try {
        let user = await User.findOne({ email: req.body.email });

        let reset_token = await resetToken.create({
            user: user._id,
            accessToken: crypto.randomBytes(10).toString('hex'),
            isValid: true
        });

        await reset_token.populate('user');
    
        // let job = queue.create('resetPasswords', )
    
        resetPasswordMailer.newResetToken(reset_token);  

        if(req.xhr){

            return res.status(200).json({

                data: {

                    message: "Post created!"
                }
            });
        }

    } catch (err) {
        
        console.log('Error in sending password reset email: ', err);

        return;
    }
}

module.exports.verifyToken = async function (req,res) {

    console.log('Params: ', req.query.accessToken);

    let reset_token = await resetToken.findOne({accessToken: req.query.accessToken});

    console.log('Via emailed link: \n', reset_token);

    if(reset_token.isValid){
        return res.render('reset_password', {
            title: "Codeial | Password Reset",
            reset_token: reset_token
        });    
    }
    else{

        req.flash('error', 'Reset token is invalid');
        return res.redirect('/');
    }
}

module.exports.updatePassword = async function (req, res) {
    
    try {

        let reset_token = await resetToken.findOne({accessToken: req.body.accessToken});

        reset_token.isValid = false;

        reset_token.save();

        console.log(reset_token);

        console.log('Password reset. Final reset token: \n', reset_token);

        const newPassword = req.body.password;
        const userId = req.body.user;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('back');
        }

        // Update the user's password
        user.password = newPassword;

        // Save the updated user
        await user.save();

        req.flash('success', 'Password updated successfully');

        return res.redirect('/users/login');
    } catch (err) {
        console.error('Error in updating password:', err);
        req.flash('error', 'Error updating password');
        return res.redirect('back');
    }
};

module.exports.addFriend = async function (req,res) {

    let from_id = req.user.id;

    let to_id = req.params.id;

    if(from_id === to_id){

        return res.json(200, {

            message: "You can NOT add yourself as a friend"
        });
    }

    let user_from = await User.findById(from_id);

    let user_to = await User.findById(to_id);

    let friendship = await Friendship.findOne({
        $or: [
            { $and: [{ from_user: from_id }, { to_user: to_id }] },
            { $and: [{ from_user: to_id }, { to_user: from_id }] }
        ]
    });

    console.log(friendship);

    let added = false;

    let message = "";

    if(friendship){ //Friendship already exists

        await Friendship.deleteOne(friendship);

        user_from.friendships.pull(to_id);
        await user_from.save();

        user_to.friendships.pull(from_id);
        await user_to.save();
    }
    else{

        await Friendship.create({

            from_user: from_id,
            to_user: to_id
        });

        user_from.friendships.push(to_id);
        await user_from.save();

        user_to.friendships.push(from_id);
        await user_to.save();

        added = true;
    }

    if(req.xhr){

        if(added){
            message = "Friend added";
        }
        else{

            message = "Friend removed";
        }

        return res.json(200, {

            message: message
        })
    }
};

module.exports.removeFriend = async function (req, res) {
    
    let from_id = req.user.id;
    let to_id = req.params.id;

    let user_from = await User.findById(from_id);
    let user_to = await User.findById(to_id);

    let friendship = await Friendship.findOne({
        $or: [
            { $and: [{ from_user: from_id }, { to_user: to_id }] },
            { $and: [{ from_user: to_id }, { to_user: from_id }] }
        ]
    });

    console.log(friendship);

    let removed = false;

    let message = "";

    if (friendship) {
        await Friendship.deleteOne(friendship);

        user_from.friendships.pull(to_id);
        await user_from.save();

        user_to.friendships.pull(from_id);
        await user_to.save();

        removed = true;
    }

    if (req.xhr) {
        if (removed) {
            message = "Friend removed";
        } else {
            message = "Friend not found";
        }

        return res.json(200, {
            message: message
        });
    }
};
