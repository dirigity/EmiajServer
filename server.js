require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs")

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body

    res.status(201).json({});

    subscriptions.push(req.body)

    save()

    const payload = JSON.stringify({
        title: 'Subscription',
        content: 'The subscription was successful'
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
});

const time = 1000;

function save(){
    writeStream = fs.createWriteStream("serverPersistence.json")
    let data = {
        "subscriptions": subscriptions
    }
    writeStream.write(JSON.stringify(data))
    writeStream.end();
}

function load(){
    // todo
    let data = JSON.parse(fs.readFileSync("serverPersistence.json"))
    subscriptions = data.subscriptions;
}
load()

function nofifyAll(payload){
    for (let s = 0; s < subscriptions.length; s++) {
        webPush.sendNotification(subscriptions[s], payload)
            .catch(error => console.error(error));
    }
}

function tick(){
    nofifyAll(JSON.stringify({
        title: 'tick',
        content: 'goes the clock'
    }));

    setTimeout(tack, time);
}

function tack() {
    nofifyAll(JSON.stringify({
        title: 'tack',
        content: 'goes the clock'
    }));

    setTimeout(tick, time);
}

tick()

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});