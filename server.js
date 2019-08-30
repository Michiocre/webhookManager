const express = require('express');
const app = express();
const childProcess = require('child_process');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

let port = process.env.port;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());

app.post('/osuTime', function (req, res) {
    res.send('osuTime');
    var sender = req.body.sender;
    var branch = req.body.ref;
    if(branch === 'refs/heads/master' && sender.login === 'Michiocre'){
        console.log(res);
    }
});

app.post('/spoti-vote/backend', function (req, res) {
    res.send('spoti-vote');
    var sender = req.body.sender;
    var branch = req.body.ref;
    if(branch === 'refs/heads/master' && sender.login === 'Michiocre'){
        console.log(res);
    }
});

app.listen(port, () => {
    console.log('Webhook Manger is running on Port: ' + port + '!');
});