import mongoose from 'mongoose';
import * as config from '../config';
import User from './entity/User';

export default class DbConnection {
    connect(): void {
        mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Database connected');
        });
    }
}