module.exports.users = function(req,res){

    res.end(`<h1>Users</h1>`);
}

module.exports.profile = function(req,res){

    res.render('user_profile', {
        title: "Profile page"
    });
}

module.exports.posts = function(req,res){

    res.end(`<h1>User's Posts</h1>`);
}