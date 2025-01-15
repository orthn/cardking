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

const getButtonStyle = () => `
    background-color: #57BC90; 
    color: white; 
    border: none; 
    padding: 10px 20px; 
    border-radius: 5px; 
    font-size: 16px; 
    cursor: pointer; 
    text-align: center;
    text-decoration: none;
`;

const sendResetMail = function (user, resetToken) {
    // Create a transporter object using the default SMTP transport
    let transporter = createTransporter();
    const buttonStyle = getButtonStyle();

    const _url = `http://localhost:5173/reset-password/${resetToken}`;
    //TODO: create better sounding email Body
    const mailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p>Hi ${user.username},</p>
            <p>We received a request to reset your password. To proceed, please click the link below:</p>
            <p><a href="${_url}" style="buttonStyle">Reset Your Password</a></p>
            <p>Note that this link will expire in one hour. If you don't reset your password within that time frame, you'll need to request a new link.</p>
            <p>If you didn't make this request or need further assistance, please don't hesitate to reach out to our support team.</p>
            <p>Protecting your account is our top priority.</p>
            <p>Thank you,<br>CardKing Support Team</p>
        </body>
        </html>
    `;
// Setup email data
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: 'Reset your password',
        html: mailBody
    };

// Send email
    transporter.sendMail(mailOptions).then(info => console.log("Mail successfully sent!")).catch(err => console.log(`Error sending email: ${err}`));
}

const sendReminder = function (email, streak) {
    // Create a transporter object using the default SMTP transport
    let transporter = createTransporter();
    const buttonStyle = getButtonStyle();

    const _url = `http://localhost:5173`;
    const mailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <b>Extend your streak by completing a quiz:</b> <br>
            <a href="${_url}" style="${buttonStyle}">CardKing</a>
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
const sendUnsuccessfulLoginMail = function (user) {
    // Create a transporter object using the default SMTP transport
    let transporter = createTransporter();
    const buttonStyle = getButtonStyle();

    const _url = `http://localhost:5173`;
    const mailBody = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p>Hi ${user.username},</p>
            <p>We’ve detected three unsuccessful login attempts to your account on CardKing.</p>
            <p>If these attempts were made by you and you are experiencing login issues, please reset your password using the link below:</p>
            <a href="${_url}" style="${buttonStyle}">Reset Password</a>
            <p>If you don’t recognize this activity, you might consider changing your password to a more secure one.</p>
            <p></p>
            <p>If you need further assistance or believe this alert was sent in error, please contact our support team.</p>
            <p>Your account security is our top priority.</p>
            <p>Thank you,<br>CardKing Support Team</p>
        </body>
        </html>
    `;

    // Setup email data
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: "Security Alert: Unsuccessful Login Attempts on Your Cardking Account",
        html: mailBody,
    };

    // Send email
    transporter.sendMail(mailOptions).then(info => console.log("Mail successfully sent!")).catch(err => console.log(`Error sending email: ${err}`));

}

module.exports = {sendResetMail, sendReminder, sendUnsuccessfulLoginMail};