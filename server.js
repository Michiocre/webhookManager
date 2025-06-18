const express = require('express');
const app = express();
require('dotenv').config();
const { exec } = require('node:child_process');
const { createHmac } = require('node:crypto');

app.get('/', function (req, res) {
    res.send('running');
});

app.post('/:service', express.json({type: 'application/json'}), (req, res) => {
    console.log(req.params);
    console.log(req.body);
    const payload = JSON.stringify(req.body);
    let sig = 'sha1=' + createHmac('sha1', process.env.SECRET).update(payload).digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
        var sender = req.body.sender;
        var branch = req.body.ref;
        if(branch === 'refs/heads/master' && sender.login === 'Michiocre'){
            res.sendStatus(200);
            exec(`./${req.params.service}.sh`, function(err){
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
            });
        }
    } else {
        console.log(process.env.SECRET);
        console.log(sig);
        console.log(req.headers['x-hub-signature']);
        return res.sendStatus(403);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Webhook Manger is running on Port: ' + process.env.PORT + '!');
});