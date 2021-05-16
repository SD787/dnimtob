import mongoose from 'mongoose';
import TokenGenerator from 'uuid-token-generator';

const userSchema = new mongoose.Schema({
    mail: String,
    password: String,
    token: String
});

const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);

userSchema.methods.generateNewToken = function() : String {
    return this['token'] = tokgen2.generate();
}

export default class User extends mongoose.model('User', userSchema) {

    static findOneUserByMail(mail: String, callback: (err: any, res: any) => void): void {
        User.findOne({'mail': mail}).exec(callback);
    }

    static findOneUserByMailAndPassword(mail: String, password: String, callback: (err: any, res: any) => void): void {
        User.findOne({'mail': mail, 'password': password}).exec(callback);
    }

    static findOneUserByToken(token: String, callback: (err: any, res: any) => void): void {
        User.findOne({'token': token}).exec(callback);
    }

    static findOneUserById(id: String, callback: (err: any, res: any) => void): void {
        User.findOne({'_id': id}).exec(callback);
    }
}