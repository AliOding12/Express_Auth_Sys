const app = require('express');
const validateSession = require('./middleware');
const Router = app.Router();

const {login} = require('./controller');
const {logout} = require('./controller');
const {dashboard}=require('./controller');

Router.post('/login',login);
Router.post('/logout',logout);
Router.get('/dashboard',validateSession,dashboard);

module.exports = Router;


// Router.get('/dashboard', validateSession, (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
// });