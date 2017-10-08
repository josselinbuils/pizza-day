'use strict';

const fs = require('fs');
const mustache = require('mustache');
const nodeMailer = require('nodemailer');

const config = require('./config');
const Logger = require('./logger');

const templateDir = process.cwd() + '/server/mail-templates/';
const attachments = {
    reminder: [{
        filename: 'logo.png',
        path: templateDir + 'logo.png',
        cid: 'logo.png'
    }, {
        filename: 'pizza-day.png',
        path: templateDir + 'pizza-day.png',
        cid: 'pizza-day.png'
    }, {
        filename: 'smiley.png',
        path: templateDir + 'smiley.png',
        cid: 'smiley.png'
    }],
    welcome: [{
        filename: 'logo.png',
        path: templateDir + 'logo.png',
        cid: 'logo.png'
    }, {
        filename: 'smiley.png',
        path: templateDir + 'smiley.png',
        cid: 'smiley.png'
    }, {
        filename: 'welcome.png',
        path: templateDir + 'welcome.png',
        cid: 'welcome.png'
    }]
};
const transporter = nodeMailer.createTransport(config.mail);

module.exports = class MailService {

    static send(to, subject, template, data) {
        Logger.info('Send ' + template + ' email to ' + to);

        fs.readFile(templateDir + 'base.html', 'utf8', (error, baseTemplateData) => {

            if (error) {
                return Logger.error(error.stack);
            }

            fs.readFile(templateDir + template + '.html', 'utf8', (error, templateData) => {

                if (error) {
                    return Logger.error(error.stack);
                }

                fs.writeFile('/tmp/' + template + '.html', mustache.render(baseTemplateData, {body: mustache.render(templateData, data)}), (err) => {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });

                transporter.sendMail({
                    from: 'PizzaDay <' + config.mail.auth.user + '>',
                    to: to,
                    subject: subject,
                    html: mustache.render(baseTemplateData, {body: mustache.render(templateData, data)}),
                    attachments: attachments[template]
                }, (error, info) => error ? Logger.error(error.stack) : Logger.info('Email sent: ' + info.response));
            });
        });
    }
};