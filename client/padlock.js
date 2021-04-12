
function padlockOnLoad() {

    console.log("drawing title")

    let canvasTitle = document.getElementById("padlockTitleCanvas")
    let ctx = canvasTitle.getContext('2d')
    canvasTitle.height = canvasTitle.clientHeight * 2
    canvasTitle.width = canvasTitle.clientWidth * 2

    //console.log(canvasTitle.height, canvasTitle.width)
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0, 0, canvasTitle.width, canvasTitle.height)

    //ctx.filter = "drop-shadow(0px 0px 10px rgb(70,70,70))"
    let emiaj = [95, 955, 1003, 995, 795, 255, 187, 235, 227, 27]// [56, 224, 64, 160, 132]

    Disp = document.getElementById("padlockDispCanvas")
    let ctxD = Disp.getContext('2d')

    Disp.height = Disp.clientHeight * 2
    Disp.width = Disp.clientWidth * 2

    drawText([0, 0, 0, 0], Disp.width / 2, Disp.height / 4, Disp.height / 2, Disp.width, ctxD, 30)
    drawText([0, 0, 0, 0], Disp.width / 2, Disp.height * 3 / 4, Disp.height / 2, Disp.width, ctxD, 30)


    Inpt = document.getElementById("padlockInptCanvas")
    let ctxI = Inpt.getContext('2d')

    Inpt.height = Inpt.clientHeight * 2
    Inpt.width = Inpt.clientWidth * 2

    drawText([7, 7, 7, 7], Inpt.width / 2, Inpt.height / 2, Inpt.height, Inpt.width, ctxI, 30)



    slowDrawText(emiaj, canvasTitle.width / 2, canvasTitle.height / 2, canvasTitle.height, canvasTitle.width, ctx, 0, 0, startLogIn)

}


async function startLogIn() {
    console.log("hallo")
    await fetch("/PassQues").then((response) => {
        console.log("hallo2")
        response.json().then((p) => {
            console.log(JSON.parse(p))

            if (JSON.parse(p).OK) {
                let t1 = JSON.parse(p).q.map((e) => { return e[0] })
                let t2 = JSON.parse(p).q.map((e) => { return e[1] })

                Disp = document.getElementById("padlockDispCanvas")
                let ctx = Disp.getContext('2d')

                Disp.height = Disp.clientHeight * 2
                Disp.width = Disp.clientWidth * 2

                slowDrawText(t1, Disp.width / 2, Disp.height / 4, Disp.height / 2, Disp.width, ctx, 30, 0, () => { })
                slowDrawText(t2, Disp.width / 2, Disp.height * 3 / 4, Disp.height / 2, Disp.width, ctx, 30, 0, () => { })

            } else {
                alert("Server didnt cooperate, try again in 5 mins")
            }


        })

    })
}

function resizePadlock() {
    //let pad = document.getElementById("padlock")
    factor = Math.min(window.innerWidth / 500, window.innerHeight / 500)
    XDelta = (window.innerWidth - 500 * factor) / 2;
    YDelta = (window.innerHeight - 500 * factor) / 2;
    let transformStr = "matrix(" + factor + ",0,0," + factor + "," + XDelta + "," + YDelta + ")"// matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY()) "transform: scale(" + factor + ") translate(" + XDelta + "," + YDelta + ")"
    document.getElementById("padlock").style.transform = transformStr
}

function rand(min, max) {
    return Math.floor(min + (Math.random() * (max - min)))
}