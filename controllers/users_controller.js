const passport = require('passport');
const User = require('../models/user');

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

        console.log('Error: ', err);

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

        console.log('Error: ', err);

        return;
    }
};

module.exports.update = async function (req, res) {

    try {

        if (req.user.id == req.params.id) {

            await User.findByIdAndUpdate(req.params.id, req.body);
            console.log('Successfuly updated user profile.');



            return res.redirect('back');

        }
        else {

            console.log('User not authorized to update this profile');

            return res.status(401).send('Unauthorized');
        }
    } catch (err) {

        console.log('Error: ', err);

        return;
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

            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);

            return res.redirect('http://localhost:8000/users/login');

        } else {

            console.log('User with this email already exists');
            res.redirect('back');
        }

    } catch (err) {

        console.log('Error: ', err);

        return;
    }
};

module.exports.logout = function (req, res) {

    req.logout(function (err) {
        if (err) {
            console.log('Error logging out:', err);
            return res.redirect('/');
        }
        // Redirect to the home page or any other page you want after successful logout
        return res.redirect('/');
    });
};

module.exports.createSession = function (req, res) {

    return res.redirect('http://localhost:8000');
}