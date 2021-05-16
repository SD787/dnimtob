import User from "../data/entity/User";

export default class BaseEndpoint {

    static serverError(res: any, message: String): void {
        res.set('Cache-control', 'no-store');
        res.status(500);
        res.send(message);
    }

    static clientError(res: any, message: String): void {
        res.set('Cache-control', 'no-store');
        res.status(400);
        res.send(message);
    }

    static clientUnauthorizedError(res: any, message ?: String): void {
        res.set('Cache-control', 'no-store');
        res.status(401);
        res.send(message || 'Unauthorized');
    }

    static clienBadToken(res: any): void {
        res.set('Cache-control', 'no-store');
        res.status(403);
        res.send("bad token");
    }

    static success(res: any): void {
        res.set('Cache-control', 'no-store');
        res.send({success: true});
    }

    static sendJson(res: any, body: any): void {
        res.set('Content-Type', 'application/json');
        res.set('Cache-control', 'no-store');
        res.send(body);
    }

    static getUserByToken(req: any, res: any, callback: (user: User) => void): void {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader
            && typeof bearerHeader == 'string'
            && bearerHeader.split(' ').length == 2
            && bearerHeader.split(' ')[1] != null
            && bearerHeader.split(' ')[1].length > 0) {
            const bearerToken = bearerHeader.split(' ')[1];
            User.findOneUserByToken(bearerToken, function(err, user) {
                if (err) {
                    return BaseEndpoint.serverError(res, err);
                }
                if (!user) {
                    return BaseEndpoint.clienBadToken(res);
                }
                callback(user);
            });
        } else {
            return BaseEndpoint.clientUnauthorizedError(res);
        }
    }

}