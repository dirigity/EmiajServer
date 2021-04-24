const webPush = require('web-push');
require('dotenv').config({ path: 'variables.env' });
const fileMan = require("./FileManager.js")


const PingPeriod = 1000;

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

function ping() {
    nofifyAll_(JSON.stringify({
        "pushPurpose": "Ping"
    }));
    setTimeout(ping, PingPeriod)
}

async function nofifyAll_(payload) {
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")
    
    // if (payload.pushPurpose != "Ping")
    //     console.log("push:", payload)
    for (let i = 0; i < ServerPersistence.subscriptions.length; i++) {
        payload.suposedid = ServerPersistence.subscriptions[i].id
        await webPush.sendNotification(ServerPersistence.subscriptions[i].link, payload)
            .catch(err => {
                ServerPersistence.subscriptions.splice(i, 1)
                i--
                console.log("forgoten expired subscription")
            })
    }
    //console.log("saving2", ServerPersistence)

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

}

function getUnusedId_(){
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")

    let id = 0;

    for (i in ServerPersistence.subscriptions) {
        id = Math.max(id, ServerPersistence.subscriptions[i].id)
    }
    id++
    console.log("choosen id:", id)

    return id
}

function newSubscription_(subscription){
    let NewSubs = []

    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")

    for (let i in ServerPersistence.subscriptions) {
        // console.log("PushNot l61: ", ServerPersistence.subscriptions[i].id, ServerPersistence.subscriptions, i)
        if (ServerPersistence.subscriptions[i].id != subscription.id && ServerPersistence.subscriptions[i].link.endpoint != ServerPersistence.subscription.link.endpoint) {
            NewSubs.push(ServerPersistence.subscriptions[i])
        }
    }
    ServerPersistence.subscriptions = NewSubs;

    // add current link

    //console.log("pushing",subscription)
    ServerPersistence.subscriptions.push(subscription)

    // console.log("saving",ServerPersistence, typeof ServerPersistence)

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)
}

// function save() {
//     fileMan.save("./ServerData/serverPersistence.json",ServerPersistence)
//     writeStream = fs.createWriteStream("./ServerData/serverPersistence.json")
//     let data = {
//         "subscriptions": subscriptions
//     }
//     writeStream.write(JSON.stringify(data))
//     writeStream.end();
// }

// function load() {
//     // todo
//     let data = JSON.parse(fs.readFileSync("./ServerData/serverPersistence.json"))
//     subscriptions = data.subscriptions;
// }

module.exports = {
    "nofifyAll" : (p) => {
        return nofifyAll_(p)
    },
    "newSubscription": (s)=>{
        return newSubscription_(s)
    },
    "getUnusedId" : ()=>{
        return getUnusedId_()
    },
    "init" : () => {
        ping()
        //tick()
    }
}

// const time = 15000;

// function tick() {
//     nofifyAll_(JSON.stringify({
//         title: 'tick',
//         content: 'goes the clock',
//         pushPurpose: "Notification"
//     })); 
//     console.log("tick")


//     setTimeout(tack, time);
// }

// function tack() {
//     nofifyAll_(JSON.stringify({
//         title: 'tack',
//         content: 'goes the clock',
//         pushPurpose: "Notification"

//     }));
//     console.log("tack")

//     setTimeout(tick, time);
// }

