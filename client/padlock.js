let currentSel = -1;

let FULL = Math.pow(2, 11) - 1
let answer = [FULL, FULL, FULL, FULL]
function padlockOnLoad() {

    currentSel = -1
    let touchPad = document.getElementById("numberInputState")
    let ctx = touchPad.getContext('2d')
    ctx.clearRect(0, 0, touchPad.width, touchPad.height)
    ctx.fillStyle = "#00bebe"
    ctx.textAlign = "center";
    ctx.font = "80px Arial";

    ctx.fillText("Send", touchPad.width / 2, touchPad.height / 1.9);


    console.log("drawing title")

    // let canvasTitle = document.getElementById("padlockTitleCanvas")
    // let ctx = canvasTitle.getContext('2d')
    // canvasTitle.height = canvasTitle.clientHeight //* 2
    // canvasTitle.width = canvasTitle.clientWidth //* 2

    // //console.log(canvasTitle.height, canvasTitle.width)
    // ctx.clearRect(0, 0, canvasTitle.width, canvasTitle.height)

    //ctx.filter = "drop-shadow(0px 0px 10px rgb(70,70,70))"
    let emiaj = [56, 224, 64, 160, 132]

    Disp = document.getElementById("padlockDispCanvas")
    let ctxD = Disp.getContext('2d')

    Disp.height = Disp.clientHeight * 2
    Disp.width = Disp.clientWidth * 2


    drawText([FULL, FULL, FULL, FULL], Disp.width / 2, Disp.height * 1.1 / 4, Disp.height / 2.1, Disp.width / 1.5, ctxD, 30)
    drawText([FULL, FULL, FULL, FULL], Disp.width / 2, Disp.height * 2.9 / 4, Disp.height / 2.1, Disp.width / 1.5, ctxD, 30)


    Inpt = document.getElementById("padlockInptCanvas")
    let ctxI = Inpt.getContext('2d')

    Inpt.height = Inpt.clientHeight * 2
    Inpt.width = Inpt.clientWidth * 2

    drawText(answer, Inpt.width / 2, Inpt.height / 2, Inpt.height * 0.9, Inpt.width * 0.9, ctxI, 30)



    //slowDrawText(emiaj, canvasTitle.width / 2, canvasTitle.height / 2, canvasTitle.height * 0.8, canvasTitle.width * 0.8, ctx, 0, 0, )
    startLogIn()
}


document.getElementById("padlockInptCanvas").onclick = displayTouch


function displayTouch(e) {
    let fullWidth = document.getElementById("padlockInptCanvas").clientWidth
    let sel = Math.max(Math.min(Math.floor(6 * e.offsetX / fullWidth), 4), 1) - 1

    if (currentSel != sel) {
        currentSel = sel
        let touchPad = document.getElementById("numberInputState")

        touchPad.style.display = "block"
        touchPad.height = touchPad.clientHeight * 2;
        touchPad.width = touchPad.clientWidth * 2;

        console.log(touchPad.height, touchPad.width)

        drawText([answer[sel]], touchPad.width / 2, touchPad.height / 2, touchPad.height * 0.9, touchPad.width * 0.9, touchPad.getContext('2d'), 0, 30)

    } else {
        currentSel = -1
        let touchPad = document.getElementById("numberInputState")
        let ctx = touchPad.getContext('2d')
        ctx.clearRect(0, 0, touchPad.width, touchPad.height)
        ctx.fillStyle = "#00bebe"
        ctx.textAlign = "center";
        ctx.font = "80px Arial";

        ctx.fillText("Send", touchPad.width / 2, touchPad.height / 1.9);

    }

}

document.getElementById("numberInputState").onclick = touchPadClick

function touchPadClick(e) {
    if (currentSel == -1) {
        fetch('/PassAnsw', {
            method: 'POST',
            body: JSON.stringify({
                "key": key,
                "ans": answer
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((data) => {
                data = JSON.parse(data)
                // console.log(data.OK)
                if (data.OK) {
                    AuthKey = data.aut;
                    InitAuthComunications()
                } else {
                    alert("incorrect answer")
                    location.reload();
                }
            })
        })
    } else {


        let current = answer[currentSel]
        let touchPad = document.getElementById("numberInputState")

        let segments = drawText([current], touchPad.width / 2, touchPad.height / 2, touchPad.height * 0.9, touchPad.width * 0.9, touchPad.getContext('2d'), 0)

        console.log(segments)

        let closestSeg = -1
        let minDist = 10000000000
        let p = [e.offsetX * 2, e.offsetY * 2]
        //console.log(p)
        for (let i = 0; i < segments.length; i++) { // the ponter coords are wrong (maybe /2 or something )

            let d = distToSegment(p, [segments[i].start.x, segments[i].start.y], [segments[i].end.x, segments[i].end.y])
            //console.log(p, [segments[i].start.x, segments[i].start.y], [segments[i].end.x, segments[i].end.y])
            //console.log("d to " + i + " is " + d)

            // marker(segments[i].start.x, segments[i].start.y, touchPad.getContext('2d'))
            // marker(segments[i].end.x, segments[i].end.y, touchPad.getContext('2d'))
            // marker(p[0], p[1], touchPad.getContext('2d'))

            if (d < minDist) {
                closestSeg = i
                minDist = d
            }
        }

        let CurrentBin = getBinaryArr(current)
        CurrentBin[closestSeg] = CurrentBin[closestSeg] == 0 ? 1 : 0

        current = getIntFromBinArr(CurrentBin)

        console.log(CurrentBin)

        answer[currentSel] = current
        console.log(closestSeg)

        Inpt = document.getElementById("padlockInptCanvas")
        let ctxI = Inpt.getContext('2d')
        drawText(answer, Inpt.width / 2, Inpt.height / 2, Inpt.height * 0.9, Inpt.width * 0.9, ctxI, 30)

        drawText([current], touchPad.width / 2, touchPad.height / 2, touchPad.height * 0.9, touchPad.width * 0.9, touchPad.getContext('2d'), 0, 30)

    }
}

function getBinaryArr(n) {
    ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < ret.length; i++) {
        ret[i] = n % 2
        n = Math.floor(n / 2)
    }
    return ret
}

function getIntFromBinArr(arr) {
    let ret = 0

    for (let i = 0; i < arr.length; i++) {
        ret += arr[i] * Math.pow(2, i)
    }
    return ret
}

function distToSegment(p, v, w) { // p:[x,y], v:[x,y], w:[x,y]
    let l2 = l([w, v]) * l([w, v]);
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return l([p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]]);
}

function l(w) {
    return Math.sqrt((w[0][0] - w[1][0]) * (w[0][0] - w[1][0]) + (w[0][1] - w[1][1]) * (w[0][1] - w[1][1]))
}

let key = "none"

async function startLogIn() {
    //console.log("hallo")
    await fetch("/PassQues").then((response) => {
        //console.log("hallo2")
        response.json().then((p) => {
            //console.log(JSON.parse(p))
            let response = JSON.parse(p)

            if (response.OK) {
                let t1 = response.q.map((e) => { return e[0] })
                let t2 = response.q.map((e) => { return e[1] })

                Disp = document.getElementById("padlockDispCanvas")
                let ctx = Disp.getContext('2d')

                Disp.height = Disp.clientHeight * 2
                Disp.width = Disp.clientWidth * 2

                slowDrawText(t1, Disp.width / 2, Disp.height * 1.1 / 4, Disp.height / 2.1, Disp.width / 1.5, ctx, 30, 0, () => { })
                slowDrawText(t2, Disp.width / 2, Disp.height * 2.9 / 4, Disp.height / 2.1, Disp.width / 1.5, ctx, 30, 0, () => { })

                key = response.key;
                console.log("key:", key)

            } else {
                alert("Server didnt cooperate, try again in 5 mins")
            }


        })

    })
}
let YTranslationAcc = 10;
let YTranslationSpeed = 0
let YTranslation = 0;

function resizePadlock() {
    //let pad = document.getElementById("padlock")
    factor = Math.min(window.innerWidth / 500, window.innerHeight / 300)
    XDelta = (window.innerWidth - 500 * factor) / 2;
    YDelta = (window.innerHeight - 300 * factor) / 2;
    YTranslation = TerminalState == "Authorized" ? YTranslation + YTranslationSpeed : YTranslation;
    let transformStr = "matrix(" + factor + ",0,0," + factor + "," + XDelta + "," + (YDelta + YTranslation) + ")"// matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY()) "transform: scale(" + factor + ") translate(" + XDelta + "," + YDelta + ")"
    document.getElementById("padlock").style.transform = transformStr
}

function rand(min, max) {
    return Math.floor(min + (Math.random() * (max - min)))
}

function marker(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}