require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs")

const app = express();

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, 'client')));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const PingPeriod = 1000;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body

    res.status(201).json({});

    // remove links with the same id

    let NewSubs = []

    for (let i in subscriptions) {
        if (subscriptions[i].id != subscription.id) {
            NewSubs.push(subscriptions[i])
        }
    }
    subscriptions = NewSubs;

    // add current link

    subscriptions.push(req.body)

    save()

    // give feedback to client

    const payload = JSON.stringify({
        pushPurpose: "Conection established"
    });
    webPush.sendNotification(subscription.link, payload)
        .catch(error => console.error(error));
});

app.get('/GetId', (req, res) => {
    let id = 0;

    console.log("New id querry")

    for (i in subscriptions) {
        id = Math.max(id, subscriptions[i].id)
    }
    id++
    console.log("choosen id:", id)

    //res.sendStatus(200);
    res.json(JSON.stringify({ "id": id }))
});


function save() {
    writeStream = fs.createWriteStream("serverPersistence.json")
    let data = {
        "subscriptions": subscriptions
    }
    writeStream.write(JSON.stringify(data))
    writeStream.end();
}

function load() {
    // todo
    let data = JSON.parse(fs.readFileSync("serverPersistence.json"))
    subscriptions = data.subscriptions;
}
load()


function nofifyAll(payload) {
    for (let i = 0; i < subscriptions.length; i++) {
        webPush.sendNotification(subscriptions[i].link, payload)
            .catch(err => {
                subscriptions.splice(i, 1)
                i--
                console.log("forgoten expired subscription")

            })
    }
    save();
}

app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

// ping 

function ping() {
    nofifyAll(JSON.stringify({
        pushPurpose: "Ping"
    }));
    setTimeout(ping, PingPeriod)
}

ping()

const time = 60000;

function tick() {
    nofifyAll(JSON.stringify({
        title: 'tick',
        content: 'goes the clock',
        pushPurpose: "Notification"
    }));

    setTimeout(tack, time);
}

function tack() {
    nofifyAll(JSON.stringify({
        title: 'tack',
        content: 'goes the clock',
        pushPurpose: "Notification"

    }));

    setTimeout(tick, time);
}

tick()