let palete = document.getElementById("PredatorPalete")

let CharH = 200
let CharW = 100
let margin = 10
let scale = 2

function draw(charArr, x, y, ctx, h, w) { // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    for (let i in charArr) {
        console.log("drawing", charArr[i])

        ctx.drawImage(palete, scale * (charArr[i] * (CharW + 2 * margin)), 0, scale * (2 * margin + CharW), scale * (2 * margin + CharH), x + i * w / charArr.length, y, w / charArr.length, h);

    }

}