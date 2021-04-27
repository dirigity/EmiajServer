// const webPush = require('web-push');
// require('dotenv').config({ path: 'variables.env' });
const fileMan = require("./FileManager.js")


// const PingPeriod = 1000;

// const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
// const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

async function nofifyAll_(title, content) {
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")

    ServerPersistence.Notifications.push({
        "title": title,
        "content": content,
        "time": Date.now()
    })

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

}

module.exports = {
    "nofifyAll": (p) => {
        return nofifyAll_(p)
    },
}

const time = 15000;

function tick() {
    nofifyAll_('tick', 'goes the clock');
    console.log("tick")

    setTimeout(tack, time);
}

function tack() {
    nofifyAll_('tack', 'goes the clock');
    console.log("tack")

    setTimeout(tick, time);
}

tick()

