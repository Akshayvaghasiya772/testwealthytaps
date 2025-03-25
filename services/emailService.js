// const cron = require('node-cron');
const User = require("../model/user");
const nodemailer = require("nodemailer");
let ejs = require("ejs");
const path = require("path");
const API_URL = process.env.API_URL;
const moment = require("moment-timezone");
const logger = require("./logger");

const sendOtpViaEmail = async ({ email, sub, body, html }) => {
    try {
        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_SENDER_EMAIL, // Your Gmail address
                pass: process.env.MAIL_SENDER_PASSWORD, // Your Gmail password or App Password
            },
            port: 587,
        });

        // Setup email data with unicode symbols
        let mailOptions = {
            from: `${process.env.MAIL_SENDER_NAME} ${process.env.MAIL_SENDER_EMAIL}`, // Sender address
            to: email, // List of recipients
            subject: sub, // Subject line
            text: body, // Plain text body
            html: html, // HTML body
        };

        // Send mail with defined transport object
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger.error("Error - send mail: ", error);
            }
            console.log("Mail Sent Successfully");
        });
    } catch (error) {
        logger.error("Error - sendOtpViaEmail", error);
        throw new Error(error.message ?? error);
    }
};

// const sendOtpViaEmail = async ({ email, sub, body, html }) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.ethereal.email',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.MAIL_SENDER_EMAIL,
//                 pass: process.env.MAIL_SENDER_PASSWORD,
//             },
//         });
//         const mailOptions = {
//             from: `${process.env.MAIL_SENDER_NAME} ${process.env.MAIL_SENDER_EMAIL}`,
//             to: email,
//             subject: sub,
//             text: body,
//             html: html,
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return logger.error('Error - send mail:', error);
//                 ;
//             }
//             console.log('Mail Sent Successfully');
//             console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
//         });
//     } catch (error) {
//         logger.error('Error - send email service:', error.message);
//     }
// };

module.exports = {
    sendOtpViaEmail,
};
