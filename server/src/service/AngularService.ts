import express, { Server } from "express";
import path from "path";

export default class AngularService {

    static registerAngularRoutes(app: Server, angularRoutes: string[]): void {
        app.get(/.(\.js)|(\.css)|(\.ico)/, express.static('../client/dist/dnimtob', { maxAge: 31536000000 }));
        angularRoutes.push('/');
        angularRoutes.push('/index.html');
        angularRoutes.forEach(route => {
            console.log('Adding angular route : "' + route + '"');
            app.get(route, function(req, res) {
                res.set('Cache-control', 'no-store');
                res.sendFile('index.html', { root: path.join(__dirname, '../../../client/dist/dnimtob') });
            });
        });
    }

}