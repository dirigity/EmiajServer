const fileMan = require("./FileManager.js")

module.exports = (l) => {
    console.log(l)
    let logs = fileMan.load("ServerData/log.txt")
    logs += "\n[" + timeStr() + "]:" + l;

    fileMan.save("ServerData/log.txt", logs)
}

function timeStr() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    // prints time in HH:MM format
    // console.log(hours + ":" + minutes);
}