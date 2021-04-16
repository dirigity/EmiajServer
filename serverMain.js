require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Push = require("./PushNotifications")
Push.init()


const Trainer = require("./PersonalTrainer")
Trainer.init()

const app = express();

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, 'client')));


let ChainedMistakes = 0;
let AdmisionRequests = []
let AdmitedClients = []
let password = process.env.pasword
let digitTranslation = [95, 955, 1003, 995, 795, 255, 187, 235, 227, 27]

app.get('/PassQues', (req, res) => {
    console.log("PassQuest request")

    let AdmisionAnwsers = []
    let AdmisionQuestions = []

    for (let c in password) {
        let q = rand(10, 99, AdmisionQuestions)
        let a = q % (Number.parseInt(password[c]))
        AdmisionQuestions.push(q)
        AdmisionAnwsers.push(a)
    }

    let send = []

    for (let i in AdmisionQuestions) {
        let translation = []
        for (let c in AdmisionQuestions[i] + "") {
            translation.push(digitTranslation[Number.parseInt((AdmisionQuestions[i] + "")[c])])
        }
        send.push(translation)
    }

    let k = key()

    setTimeout(() => {
        for (let s in AdmisionRequests) {
            if (AdmisionRequests[s].key == k) {
                delete AdmisionRequests[s]
            }
        }
    }, 2 * 60 * 1000); // only 2 minutes to respond

    setTimeout(() => {
        AdmisionRequests.push({
            "key": k,
            "correctAnswer": AdmisionAnwsers
        })

        res.json(JSON.stringify({ "q": send, "OK": true }))

    }, ChainedMistakes * 500); // register querry


    // if (AdmisionState == "NotStarted") {
    //     AdmisionState = "StartedWaiting"
    //     setTimeout(() => {
    //         AdmisionState = "NotStarted"
    //         AdmisionQuestions = []
    //         AdmisionAnwsers = []
    //         console.log("PassQuest timeout")

    //     }, 60 * 2 * 1000) // 2MinsToSolveIt
    //     setTimeout(() => {

    //         for (let c in password) {
    //             let q = rand(0, 99, AdmisionQuestions)
    //             let a = q % (Number.parseInt(password[c]))
    //             AdmisionQuestions.push(q)
    //             AdmisionAnwsers.push(a)
    //         }

    //         let send = []

    //         for (let i in AdmisionQuestions) {
    //             let translation = []
    //             for (let c in AdmisionQuestions[i] + "") {
    //                 translation.push(digitTranslation[Number.parseInt((AdmisionQuestions[i] + "")[c])])
    //             }
    //             send.push(translation)
    //         }
    //         console.log("PassQuest response")


    //         res.json(JSON.stringify({ "q": send, "OK": true }))

    //         AdmisionState = "Sent"
    //     }, Math.min(1000 * 60 * 5, 1000 * ChainedMistakes));
    // } else {
    //     res.json(JSON.stringify({ "q": [], "OK": false }))
    // }
})

app.get('/PassAnsw', (req, res) => {
    let ans = req.body.ans
    let authorized = false

    for (let s in AdmisionRequests) {
        if (arrEq(AdmisionRequests[s].correctAnswer, ans)) {
            authorized = true
        }
    }

    if (authorized) {
        Authoritation = key()
        ChainedMistakes = 0
        AdmitedClients.push({
            "key": Authoritation
        })
        res.json(JSON.stringify({ "aut": Authoritation, "OK": true }))
    } else {
        res.json(JSON.stringify({ "aut": "", "OK": false }))
    }

})

app.post('/subscribe', (req, res) => {
    res.status(201).json({});

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
        "<", ">", ",", "\"", "%", "&", "/", ".", "-", "_", "`", "^", "+", "*", "{", "}", "_", "]", "[", "#", ":"
    ]
    let ret = ""

    for (let i = 0; i < keyLenght; i++) {
        ret += IntToChar[rand(0, IntToChar.length,[])]
    }
    return ret;
}

function arrEq(a,b) {
    if(a.length != b.length) return false
    for (let i = 0; i < a.length; i++) {
        if(a[i] != b[i]){
            return false
        }
    }
    return true
}



//const time = 6000;

// function tick() {
//     Push.nofifyAll(JSON.stringify({
//         title: 'tick',
//         content: 'goes the clock',
//         pushPurpose: "Notification"
//     }));

//     setTimeout(tack, time);
// }

// function tack() {
//     Push.nofifyAll(JSON.stringify({
//         title: 'tack',
//         content: 'goes the clock',
//         pushPurpose: "Notification"

//     }));

//     setTimeout(tick, time);
// }

// tick()