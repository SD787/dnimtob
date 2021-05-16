import { Server } from 'express';
import Sanitizer from 'sanitizer';
import EndpointUtils from './EndpointUtils';
import User from '../data/entity/User';
import Article from '../data/entity/Article';

export default class ArticleEndpoint {

    static registerArticleEndpoint(app: Server): void {

        app.post('/api/article/create', (req, res) => {
            EndpointUtils.getUserByToken(req, res, (user) => {
                const text = req.body.text;
                if (text == null || typeof text != 'string' || text.length == 0 || text.length > 4096) {
                    return EndpointUtils.clientError(res, 'error in parameters');
                }

                // Everything is fine
                let secureText = Sanitizer.escape(text);
                let secureTextWithLHTMLLines = secureText.replace(/\n/g, '<br/>');
                let newArticle = new Article({'text': secureTextWithLHTMLLines, 'user': user.id, 'date': Date.now()});
                newArticle.save();
     
                EndpointUtils.success(res);
            });
        });

        app.get('/api/articles', (req, res) => {
            EndpointUtils.getUserByToken(req, res, (user) => {
                Article.findLast((err, articles) => {
                    if (err != null) {
                        return EndpointUtils.serverError(res, err);
                    }
                    EndpointUtils.sendJson(res, Article.publicFormat(articles));
                });
            });
        });

        app.get('/api/articles/skip/:skip', (req, res) => {
            EndpointUtils.getUserByToken(req, res, (user) => {
                var skip = req.params.skip;
                if (skip == null) {
                    return EndpointUtils.clientError(res, 'error in parameters');
                }
                const skipParsed = parseInt(skip, 10);
                if (isNaN(skipParsed)) {
                    return EndpointUtils.clientError(res, 'error in parameters');
                }
                Article.findSkipped(skip, (err, articles) => {
                    if (err != null) {
                        return EndpointUtils.serverError(res, err);
                    }
                    EndpointUtils.sendJson(res, Article.publicFormat(articles));
                });
            });
        });
    }
}