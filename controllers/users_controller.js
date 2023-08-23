const passport = require('passport');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

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
            
            User.uploadedAvatar(req,res, function(err){

                if(err){

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

            return res.redirect('http://localhost:8000/users/login');

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

    return res.redirect('http://localhost:8000');
}