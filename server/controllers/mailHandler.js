const nodemailer = require("nodemailer");

require('dotenv').config();

const createTransporter = function (){
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
}

const sendResetMail = function (email, resetToken) {

    // Create a transporter object using the default SMTP transport
    let transporter = createTransporter();

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

const sendReminder = function (email, streak) {
    // Create a transporter object using the default SMTP transport
    let transporter = createTransporter();

    const _url = `http://localhost:5173`;
    const mailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <b>Extend your streak by completing a quiz:</b> <br>
            <p><a href="${_url}">CardKing</a></p> <br>
            <img src="cid:crownImage" alt="crown" width="500" height="500">
            <p>Your current Streak is: ${streak}</p>
        </body>
        </html>
    `;
// Setup email data
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Don't lose your streak!",
        html: mailBody,
        attachments: [
            {
                filename: 'crown.png',
                path: 'server/assets/crown.png',
                cid: 'crownImage'
            }
        ]
    };

// Send email
    transporter.sendMail(mailOptions).then(info => console.log("Mail successfully sent!")).catch(err => console.log(`Error sending email: ${err}`));
}
module.exports = {sendResetMail, sendReminder};