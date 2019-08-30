const express = require('express');
const app = express();
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
let crypto = require('crypto');
const result = require('dotenv').config().parsed;

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

app.get('/webhookManager', function (req, res) {
    res.send('Greeting');
});

app.post('/webhookManager/osuTime', function (req, res) {
    const payload = JSON.stringify(req.body);
    let sig = 'sha1=' + crypto.createHmac('sha1', result.OSUTIMESECRET).update(payload).digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
        var sender = req.body.sender;
        var branch = req.body.ref;
        if(branch === 'refs/heads/master' && sender.login === 'Michiocre'){
            res.sendStatus(200);
            exec(' ./osuTime.sh', function(err){
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
            });
        }
    } else {
        console.log(result.OSUTIMESECRET);
        console.log(sig);
        console.log(req.headers['x-hub-signature']);
        return res.sendStatus(403);
    }
});

app.post('/webhookManager/spoti-vote/backend', function (req, res) {
    const payload = JSON.stringify(req.body);
    let sig = 'sha1=' + crypto.createHmac('sha1', result.SPOTIVOTESECRET).update(payload).digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
        var sender = req.body.sender;
        var branch = req.body.ref;
        if(branch === 'refs/heads/master' && (sender.login === 'Michiocre' || sender.login === 'Gabsii')){
            res.sendStatus(200);
            exec(' ./spoti-vote.sh', function(err){
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
            });
        }
    } else {
        return res.sendStatus(403);
    }
});

app.listen(result.PORT, () => {
    console.log('Webhook Manger is running on Port: ' + result.PORT + '!');
});