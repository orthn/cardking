const nodemailer = require("nodemailer");

require('dotenv').config();

const sendResetMail = function (email, resetToken) {


// Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    console.log(transporter)

    const _url = `http://localhost:5173/reset-password/${resetToken}`;
    //TODO: create better sounding email Body
    const mailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p>Please use the following link to reset your password:</p> <br>
            <p><a href="${_url}">Reset Password</a></p> <br>
            <p>Plese notice that the link expires after one hour. If you do not assign a new password within this time period, you will have to request the link again.</p>
        </body>
        </html>
    `;
// Setup email data
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Reset your password',
        html: mailBody
    };

// Send email
    transporter.sendMail(mailOptions).then(info => console.log("Mail successfully sent!")).catch(err => console.log(`Error sending email: ${err}`));
}
module.exports = {sendResetMail};