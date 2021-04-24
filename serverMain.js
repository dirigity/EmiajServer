require('dotenv').config({ path: 'variables.env' });

const log = require('./Logger.js')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fileMan = require("./FileManager.js")

const Push = require("./PushNotifications")
Push.init()

const Trainer = require("./PersonalTrainer")
Trainer.init()

const app = express();

app.use(bodyParser.json()); // security threat

app.use("/", express.static(path.join(__dirname, 'client')));

let password = process.env.pasword

app.get('/PassQues', (req, res) => {
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")

    log("Someone asked for a question, wait time at: " + ServerPersistence.Auth.ChainedMistakes * 500)

    let AdmisionAnwsers = []
    let AdmisionQuestions = []

    for (let c in password) {
        let q = rand(10, 99, AdmisionQuestions)
        let a = q % (Number.parseInt(password[c]))
        AdmisionQuestions.push(q)
        AdmisionAnwsers.push(a)
    }

    let send = translate(AdmisionQuestions)

    let k = key()


    setTimeout(() => {
        let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")
        ServerPersistence.Auth.ChainedMistakes++
        let d = new Date();
        ServerPersistence.Auth.AdmisionRequests.push({
            "key": k,
            "correctAnswer": translate(AdmisionAnwsers).map(e => { return e[0] }),
            "time": d.getTime()
        })

        fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

        res.json(JSON.stringify({ "q": send, "key": k, "OK": true })) // send the querrys

    }, ServerPersistence.Auth.ChainedMistakes * 500); // register querry

})

app.post('/PassAnsw', (req, res) => {
    let ans = req.body.ans
    let authorized = false

    console.log("han intentado", ans)

    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")


    for (let s in ServerPersistence.Auth.AdmisionRequests) {
        if (ServerPersistence.Auth.AdmisionRequests[s].key == req.body.key) {
            if (arrEq(ServerPersistence.Auth.AdmisionRequests[s].correctAnswer, ans)) {
                authorized = true
            }
            ServerPersistence.Auth.AdmisionRequests.splice(s, 1)
            break;
        }
    }

    if (authorized || true) {

        let d = new Date();

        Authoritation = key()
        ServerPersistence.Auth.ChainedMistakes = 0
        ServerPersistence.Auth.AdmitedClients.push({
            "key": Authoritation,
            "time": d.getTime()
        })

        res.json(JSON.stringify({ "aut": Authoritation, "OK": true }))
    } else {
        res.json(JSON.stringify({ "aut": "", "OK": false }))
    }
    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

})

app.post('/subscribe', (req, res) => {
    res.status(201).json({});
    // console.log(req.body)
    Push.newSubscription(req.body)
});

app.get('/GetId', (req, res) => {
    let ret = Push.getUnusedId()
    console.log("New id querry, returning:", ret)

    res.json(JSON.stringify({ "id": ret }))
});

app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

// var server = https.createServer(options, app);

// var key = fs.readFileSync(__dirname + '/../certs/selfsigned.key');
// var cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt');
// var options = {
//     key: key,
//     cert: cert
// };

// const port = 8000

// server.listen(port, () => {
//     console.log("server starting on port : " + port)
// });

function rand(min, max, exclude) {

    if (exclude.length == 0) {
        return Math.floor(min + (Math.random() * (max - min)))
    }
    let ret = exclude[0]

    while (exclude.indexOf(ret) != -1) {
        //console.log("new num is: ", ret)
        ret = Math.floor(min + (Math.random() * (max - min)))
    }
    return ret
}

function key() {
    const keyLenght = 100;
    const IntToChar = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "<", ">", ",", "%", "&", "/", ".", "-", "_", "`", "^", "+", "*", "{", "}", "_", "]", "[", "#", ":"
    ]
    let ret = ""

    for (let i = 0; i < keyLenght; i++) {
        ret += IntToChar[rand(0, IntToChar.length, [])]
    }
    return ret;
}

function arrEq(a, b) {
    //console.log("comparing", a, b)
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false
        }
    }
    return true
}

let digitTranslation = [95, 955, 1003, 995, 795, 255, 187, 235, 227, 27]
function translate(word) {
    let ret = [];
    for (let i in word) {
        let translation = []
        for (let c in word[i] + "") {
            translation.push(digitTranslation[Number.parseInt((word[i] + "")[c])])
        }
        ret.push(translation)
    }
    return ret
}

const TimeToLog = 1000 * 10 * 60;
const SesionTime = 1000 * 60 * 60 * 20;

setInterval(() => { // expire sesions and stuff
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")
    let d = new Date();
    let NewReq = [];
    for (let i in ServerPersistence.Auth.AdmisionRequests) {
        if (ServerPersistence.Auth.AdmisionRequests[i].time + TimeToLog > d.getTime()) {
            NewReq.push(ServerPersistence.Auth.AdmisionRequests[i])
        }
    }
    ServerPersistence.Auth.AdmisionRequests = NewReq

    let NewAuth = [];
    for (let i in ServerPersistence.Auth.AdmitedClients) {
        if (ServerPersistence.Auth.AdmitedClients[i].time + SesionTime > d.getTime()) {
            NewAuth.push(ServerPersistence.Auth.AdmitedClients[i])
        }
    }
    ServerPersistence.Auth.AdmitedClients = NewAuth

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)
}, 1000);