import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as config from './config';
import DbConnection from './data/DbConnection';
import UserEndpoint from './endpoint/UserEndpoint';
import ArticleEndpoint from './endpoint/ArticleEndpoint';
import path from 'path';
import AngularService from './service/AngularService';


// Initialize DB connection
var dbConnection = new DbConnection();
dbConnection.connect();

// Initialize webserver
var app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(cors({
  origin: config.WEBSERVER_URL
}));

// Serve client (Angular) files
const angularRoutes = ['/login']; // Add angular routes here
AngularService.registerAngularRoutes(app, angularRoutes);

// Register API endpoints (starts with /api)
UserEndpoint.registerUserEndpoint(app);
ArticleEndpoint.registerArticleEndpoint(app);

app.listen(config.PORT, function () {
  console.log('App listening on port ' + config.PORT);
});