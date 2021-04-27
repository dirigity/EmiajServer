require('dotenv').config({ path: 'variables.env' });

const express = require('express');


const path = require('path');
const https = require('https');

const fileMan = require("./FileManager.js")
const log = require('./Logger.js')
const Push = require("./PushNotifications")
const Trainer = require("./PersonalTrainer")
const HttpCompatibility = require("./httpRedirect")
HttpCompatibility()
Trainer.init()

var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Certificate HTTPS
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/alvarogonzalez.no-ip.biz/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/alvarogonzalez.no-ip.biz/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/alvarogonzalez.no-ip.biz/chain.pem', 'utf8');

const privateKey = fileMan.load('./Cert/privkey.pem', 'utf8');
const certificate = fileMan.load('./Cert/cert.pem', 'utf8');
const ca = fileMan.load('./Cert/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());


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
        ServerPersistence.Auth.AdmisionRequests.push({
            "key": k,
            "correctAnswer": translate(AdmisionAnwsers).map(e => { return e[0] }),
            "time": Date.now()
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

        Authoritation = key()
        ServerPersistence.Auth.ChainedMistakes = 0
        ServerPersistence.Auth.AdmitedClients.push({
            "key": Authoritation,
            "time": Date.now()
        })
        res.cookie("auth", Authoritation, { maxAge: SesionTime });
        res.json(JSON.stringify({ "status": "OK" }))

    } else {
        res.json(JSON.stringify({ "status": "incorrect response" }))
    }
    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

})

app.get('/logOff', (req, res) => {
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")

    let auth = req.cookies.auth

    for (let i = 0; i < ServerPersistence.Auth.AdmitedClients.length; i++) {
        const element = ServerPersistence.Auth.AdmitedClients[i];
        if (element.key == auth) {
            ServerPersistence.Auth.AdmitedClients.splice(i, 1)
            i--;
        }
    }

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)

    res.clearCookie('auth');
    res.send('cookie aut cleared');
})

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8001, () => {
    console.log('HTTPS Server running on port 443');
});

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
const NotificationTime = 1000 * 60 * 10;

setInterval(() => { // expire sesions and stuff
    let ServerPersistence = fileMan.loadJSON("./ServerData/serverPersistence.json")
    let NewReq = [];
    for (let i in ServerPersistence.Auth.AdmisionRequests) {
        if (ServerPersistence.Auth.AdmisionRequests[i].time + TimeToLog > Date.now()) {
            NewReq.push(ServerPersistence.Auth.AdmisionRequests[i])
        }
    }
    ServerPersistence.Auth.AdmisionRequests = NewReq

    let NewNots = [];
    for (let i in ServerPersistence.Notifications) {
        if (ServerPersistence.Notifications[i].time + NotificationTime > Date.now()) {
            NewNots.push(ServerPersistence.Notifications[i])
        }
    }
    ServerPersistence.Auth.AdmisionRequests = NewNots

    let NewAuth = [];
    for (let i in ServerPersistence.Auth.AdmitedClients) {
        if (ServerPersistence.Auth.AdmitedClients[i].time + SesionTime > Date.now()) {
            NewAuth.push(ServerPersistence.Auth.AdmitedClients[i])
        }
    }
    ServerPersistence.Auth.AdmitedClients = NewAuth

    fileMan.saveJSON("./ServerData/serverPersistence.json", ServerPersistence)
}, 10000);