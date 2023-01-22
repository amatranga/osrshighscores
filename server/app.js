const express = require('express');
const path = require('path');

const middleware = require('./middleware');
const routes = require('./routes');

const publicPath = path.resolve(__dirname, '..', 'public');

const app = express();

app.use(middleware.morgan('dev'));
app.use(middleware.bodyParser.urlencoded({extended: false}));
app.use(middleware.bodyParser.json());
app.use(middleware.cookieParser());
app.use(express.static(publicPath));

app.use('/api', routes.api);

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;
