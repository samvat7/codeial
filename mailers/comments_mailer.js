const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    console.log(comment);

    console.log('inside newComment mailer');

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: `samvat.t@gmail.com`,
        to: comment.user.email,
        subject: "New comment published!",
        html: htmlString
    }, (err, info) => {

        if(err){ console.log('Error in sending mail: ', err); return;}

        console.log('Message sent', info);
        return;
    })
}