"use strict";
// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// module.exports = class Email {
//   to: string;
//   firstName: string;
//   url: string;
//   from: string;
//   constructor(user:any, url:string) {
//     this.to = user.email;
//     this.firstName = user.firstname;
//     this.url = url;
//     this.from = `divine obinna <trilvid234@gmail.com>`;
//   }
//   newTransport() {
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });
//   }
//   // Send the actual email
//   async send(template: string, subject: string) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject
//     });
//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html)
//     };
//     // 3) Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }
//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Natours Family!');
//   }
//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)'
//     );
//   }
// };
const nodemailer = require('nodemailer');
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // 2) Define the email options
    const mailOptions = {
        from: 'divine obinna <trilvid234@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.message
    };
    // 3) Actually send the email
    yield transporter.sendMail(mailOptions);
});
module.exports = sendEmail;
