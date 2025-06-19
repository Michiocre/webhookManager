const express = require('express');
const app = express();
require('dotenv').config();
const { exec } = require('node:child_process');
const { createHmac } = require('node:crypto');

app.get('/', function (req, res) {
    res.send('running');
});

app.post('/:service', express.json({type: 'application/json'}), (req, res) => {
    const payload = JSON.stringify(req.body);
    let sig = 'sha1=' + createHmac('sha1', process.env.SECRET).update(payload).digest('hex');

    if (req.headers['X-Hub-Signature'] == sig) {
        if (req.headers['X-GitHub-Event'] == 'push') {
            var branch = req.body.ref;
            
            if(branch === 'refs/heads/master' || branch === 'refs/heads/main'){
                res.sendStatus(200);
                exec(`./${req.params.service}.sh`, function(err){
                    if (err) {
                        console.error(err);
                        return res.sendStatus(500);
                    }
                });
            }
        }

        return response.status(202).send('Accepted');
    } else {
        return res.sendStatus(403);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Webhook Manger is running on Port: ' + process.env.PORT + '!');
});