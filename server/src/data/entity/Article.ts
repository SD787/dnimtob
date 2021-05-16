import mongoose, { Schema } from 'mongoose';
import User from './User';
import {Semaphore} from 'await-semaphore';

const articleSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: Date
});

const limit = 10;

export default class Article extends mongoose.model('Article', articleSchema) {

    static findLast(callback: (err: any, res: any) => void): void {
        Article.findSkipped(0, callback);
    }

    static findSkipped(skip: number, callback: (err: any, res: any) => void): void {
        Article.find({}, {}, {sort: {date: -1}, 'skip': skip, 'limit': limit, 'populate': 'user'}, callback);
    }

    static publicFormat(articles: Article[]): any[] {
        var arrRetour = [];
        articles.forEach((article) => {
            arrRetour.push({
                id: article.id,
                text: article['text'],
                date: article['date'],
                mail: article['user']['mail']
            });
        });
        return arrRetour;
    }
}