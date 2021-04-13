const fs = require("fs")
const Push = require("./PushNotifications")

let LastExTime = 0;
let lastExCode = 0

let data;

function tick() {

    let d = new Date()
    if (GetAviability()) {
        if (d.getTime - LastExTime > data.actions[lastExCode].timeOutMins * 60 * 1000) {
            lastExCode++
            LastExTime = d.getTime()
            Push.nofifyAll({
                "title": 'Trainer',
                "content": 'Do ' + data.actions[lastExCode].times + ' ' + data.actions[lastExCode].name,
                "pushPurpose": "Notification"
            })

        }
    }

    setTimeout(() => {
        tick()
    }, 1*60*1000);

}

function GetWeekDay() {
    let Days = ["L", "M", "X", "J", "V", "S", "D"]
    let d = new Date();
    return Days[d.getDay()]
}

function getCurrentTime() {
    let d = new Date();
    return { "h": d.getHours, "m": d.getMinutes }
}

function timeA_gt_B(A, B) {
    // {"h":_, "m":_}

    if (A.h > B.h) {
        return true
    }
    if (A.h == B.h && B.m > A.m) {
        return true
    }
    return false
}
function timeA_lt_B(A, B) {
    // {"h":_, "m":_}

    return timeA_gt_B(B, A)
}

function GetAviability() {
    let day = GetWeekDay()
    let range = data.aviability[day]
    let time = getCurrentTime()
    if (timeA_gt_B(time, range.start) && timeA_gt_B(range.end, time)) {
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