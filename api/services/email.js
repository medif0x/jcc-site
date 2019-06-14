'use strict';

const log = require('../logger');
const nodeMailer = require('nodemailer');

module.exports = function() {
    let email = {};

    email.sendContactForm = async function(req, res) {
        let errors = [];

        if (!req.body.firstName) {
            errors.push('first name is missing');
        }
        if (!req.body.lastName) {
            errors.push('last name is missing');
        }
        if (!req.body.email) {
            errors.push('email is missing');
        }
        if (!req.body.phone) {
            errors.push('phone number is missing');
        }

        // Message is optional
        let message = req.body.message || 'No message provided';

        if (errors.length > 0) {
            return res.json({
                success: false,
                errors: errors
            });
        }

        const messageText = `First Name: ${req.body.firstName}\n` +
            `Last Name: ${req.body.lastName}\n` +
            `Email: ${req.body.email}\n` +
            `Phone: ${req.body.phone}\n` +
            `Message: ${message}`;

        // create transporter object
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'matasempakeris@gmail.com',
                pass: 'V@je15350'
            }
        });

        // send email using transporter object
        try {
            await transporter.sendMail({
                from: '"JCC Contact Form" <noreply@jogachiropractic.com>',
                to: 'matasempakeris@gmail.com',
                subject: 'A Patient Has Contacted You!',
                text: messageText
            });

            return res.json({
                success: true
            });
        } catch(err) {
            log.error(`An error occurred while sending email from contact form => ${err}`);
            return res.status(500).json({
               success: false,
               reason: 'an internal error occurred'
            });
        }
    }

    return email;
};