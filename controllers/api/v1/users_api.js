const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function (req, res) {

        try {
            console.log(req)
            console.log("Email: ", req.body.email);
            console.log("Password : ", req.body.password);

            let user = await User.findOne({email: req.body.email});

            if(!user || user.password != req.body.password){

                return res.json(422, {
                    message: "Invalid username/password"
                })
            }
            
            return res.json(200, {
                message: "Sign in successgful, here's your token, please keep it safe!",
                data : {

                    token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
                }
            })

        } catch (err) {
            
            return res.json(500, {

                message: "Internal server error"
            });
        }

        
}