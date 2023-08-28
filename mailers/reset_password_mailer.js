const nodeMailer = require('../config/nodemailer');

exports.newResetToken = (reset_token) => {

    console.log(reset_token);

    console.log('inside newResetToken mailer');

    let htmlString = nodeMailer.renderTemplate({reset_token: reset_token}, '/resetTokens/new_reset_token.ejs');

    nodeMailer.transporter.sendMail({
        from: `samvat.t@gmail.com`,
        to: reset_token.user.email,
        subject: "Reset Password for Codeial",
        html: htmlString
    }, (err, info) => {

        if(err){ console.log('Error in sending mail: ', err); return;}

        console.log('Message sent', info);
        return;
    })
}