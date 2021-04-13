const webPush = require('web-push');
require('dotenv').config({ path: 'variables.env' });
const fs = require("fs")


const PingPeriod = 1000;

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;


webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

let subscriptions = [];

function ping() {
    nofifyAll_(JSON.stringify({
        pushPurpose: "Ping"
    }));
    setTimeout(ping, PingPeriod)
}

function nofifyAll_(payload) {
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

function getUnusedId_(){
    let id = 0;

    for (i in subscriptions) {
        id = Math.max(id, subscriptions[i].id)
    }
    id++
    console.log("choosen id:", id)

    return id

}

function newSubscription_(subscription){
    let NewSubs = []



    for (let i in subscriptions) {
        if (subscriptions[i].id != subscription.id && subscriptions[i].link.endpoint != subscription.link.endpoint) {
            NewSubs.push(subscriptions[i])
        }
    }
    subscriptions = NewSubs;

    // add current link

    subscriptions.push(subscription)

    save()
}

function save() {
    writeStream = fs.createWriteStream("./ServerData/serverPersistence.json")
    let data = {
        "subscriptions": subscriptions
    }
    writeStream.write(JSON.stringify(data))
    writeStream.end();
}

function load() {
    // todo
    let data = JSON.parse(fs.readFileSync("./ServerData/serverPersistence.json"))
    subscriptions = data.subscriptions;
}

module.exports = {
    "nofifyAll" : (p) => {
        nofifyAll_(p)
    },
    "newSubscription": (s)=>{
        newSubscription_(s)
    },
    "getUnusedId" : ()=>{
        getUnusedId_()
    },
    "init" : () => {
        load()
        ping()
    }
}