import { Server } from 'express';
import EndpointUtils from './EndpointUtils';
import User from '../data/entity/User';

export default class UserEndpoint {

    static regexEmail = /^\S+@\S+\.\S+$/gi;
    static regexPassword = /\b[0-9a-f]{40}\b/gi;

    static registerUserEndpoint(app: Server): void {

        app.post('/api/user/create', (req, res) => {
            const mail = req.body.mail;
            const password = req.body.password;

            if (mail == null || password == null
                || typeof mail != 'string' || typeof password != 'string'
                || mail.length == 0 || password.length == 0
                || mail.length > 255
                || !mail.match(this.regexEmail) || !password.match(this.regexPassword)) {
                return EndpointUtils.clientError(res, 'error in parameters');
            }
            
            User.findOneUserByMail(mail, (err, alreadyRegisteredUser) => {
                if (err != null) {
                    return EndpointUtils.serverError(res, err);
                }
                if (alreadyRegisteredUser != null) {
                    return EndpointUtils.clientError(res, 'email already exists');
                }
                
                // Everything is fine
                var newUser = new User({'mail': mail, 'password': password});
                newUser['generateNewToken']();
                newUser.save();
                EndpointUtils.sendJson(res, {
                    token: newUser['token']
                });
            });
        });

        app.post('/api/user/connect', (req, res) => {
            const mail = req.body.mail;
            const password = req.body.password;

            if (mail == null || password == null
                || typeof mail != 'string' || typeof password != 'string'
                || mail.length == 0 || password.length == 0
                || mail.length > 255
                || !mail.match(this.regexEmail) || !password.match(this.regexPassword)) {
                return EndpointUtils.clientError(res, 'error in parameters');
            }
            
            User.findOneUserByMail(mail, (err, alreadyRegisteredUser) => {
                if (err != null) {
                    return EndpointUtils.serverError(res, err);
                }
                if (alreadyRegisteredUser == null
                    || alreadyRegisteredUser['password'] != password) {
                    return EndpointUtils.clientUnauthorizedError(res, 'error in email or password');
                }
                
                // Everything is fine
                if (!alreadyRegisteredUser['token']) {
                    alreadyRegisteredUser['generateNewToken']();
                    alreadyRegisteredUser.save();
                }
                EndpointUtils.sendJson(res, {
                    token: alreadyRegisteredUser['token']
                });
            });
        });

        app.get('/api/user/disconnect', (req, res) => {
            EndpointUtils.getUserByToken(req, res, (user) => {
                user['token'] = null;
                user.save();
                EndpointUtils.success(res);
            });
        });
    }
}