const express = require('express');
const app = express();
require('dotenv').config();
const { exec } = require('node:child_process');
const crypto = require('node:crypto');

app.get('/', function (req, res) {
    res.send('running');
});

app.post('/:service', express.json({type: 'application/json'}), async (req, res) => {
    const payload = JSON.stringify(req.body);

    console.log(req.headers);

    if (await verifySignature(process.env.SECRET, req.headers['x-hub-signature-256'], payload)) {
        if (req.headers['x-github-event'] == 'push') {
            var branch = req.body.ref;
            
            if(branch === 'refs/heads/master' || branch === 'refs/heads/main'){
                res.sendStatus(200);
                exec(`/home/blank/webhookManager/${req.params.service}.sh`, function(err){
                    if (err) {
                        console.error(err);
                        return res.sendStatus(500);
                    }
                });
            }
        }

        return res.status(202).send('Accepted');
    } else {
        return res.sendStatus(403);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Webhook Manger is running on Port: ' + process.env.PORT + '!');
});

let encoder = new TextEncoder();

async function verifySignature(secret, header, payload) {
    let parts = header.split("=");
    let sigHex = parts[1];

    let algorithm = { name: "HMAC", hash: { name: 'SHA-256' } };

    let keyBytes = encoder.encode(secret);
    let extractable = false;
    let key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        extractable,
        [ "sign", "verify" ],
    );

    let sigBytes = hexToBytes(sigHex);
    let dataBytes = encoder.encode(payload);
    let equal = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    );

    return equal;
}

function hexToBytes(hex) {
    let len = hex.length / 2;
    let bytes = new Uint8Array(len);

    let index = 0;
    for (let i = 0; i < hex.length; i += 2) {
        let c = hex.slice(i, i + 2);
        let b = parseInt(c, 16);
        bytes[index] = b;
        index += 1;
    }

    return bytes;
}