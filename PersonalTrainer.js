const fs = require("fs")
const Push = require("./PushNotifications")

let LastExTime = 0;
let lastExCode = 0

let data;

function tick() {

    let d = new Date()
    //console.log("[Trainer]: aviability ", GetAviability())
    if (GetAviability()) {
        if (d.getTime() - LastExTime > data.actions[lastExCode].timeOutMins * 60 * 1000) {
            console.log("[Trainer]: sending push ")
            lastExCode++
            lastExCode = lastExCode % data.actions.length;
            LastExTime = d.getTime()
            Push.nofifyAll(JSON.stringify({
                "title": 'Trainer',
                "content": 'Do ' + data.actions[lastExCode].times + ' ' + data.actions[lastExCode].name,
                "pushPurpose": "Notification"
            }))

        }
    }

    setTimeout(() => {
        tick()
    }, 1 * 60 * 1000);

}

function GetWeekDay() {
    let Days = ["L", "M", "X", "J", "V", "S", "D"]
    let d = new Date();
    return Days[d.getDay()]
}

function getCurrentTime() {
    let d = new Date();
    return { "h": d.getHours(), "m": d.getMinutes() }
}

function timeA_laterThan_B(A, B) {
    // {"h":_, "m":_}

    if (A.h > B.h) {
        return true
    }
    if (A.h == B.h && A.m > B.m) {
        return true
    }
    return false
}

function GetAviability() {
    let day = GetWeekDay()
    let range = data.aviability[day]
    let time = getCurrentTime()
    //console.log(day, range, time)
    if (timeA_laterThan_B(time, range.start) && timeA_laterThan_B(range.end, time)) {
        return true
    }
    return false
}

module.exports = {
    init: () => {
        data = JSON.parse(fs.readFileSync("./ServerData/ExerciseRutine.json"))
        tick()
    }
}