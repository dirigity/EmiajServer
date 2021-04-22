let palete = document.getElementById("PredatorPalete")

let CharH = 200
let CharW = 100

// function draw(charArr, x, y, ctx, h, w) { // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

//     for (let i in charArr) {
//         console.log("drawing", charArr[i])
//         console.log(            scale * (charArr[i] * (CharW + (2 * margin))), 
//                                 0, 
//                                 scale * (2 * margin + CharW), 
//                                 scale * (2 * margin + CharH), 
//                                 x + i * w / charArr.length, 
//                                 y, 
//                                 w / charArr.length, 
//                                 h)

//         ctx.drawImage(palete,   scale * (charArr[i] * (CharW + (2 * margin))),
//                                 0, 
//                                 scale * (2 * margin + CharW),
//                                 scale * (2 * margin + CharH), 
//                                 x + i * w / charArr.length, 
//                                 y, 
//                                 w / charArr.length, 
//                                 h);

//     }

// }


function vec(x, y) {
    return { "x": x, "y": y }
}

function seg(s, e) {
    return { "start": s, "end": e }
}

function vecAdd(v1, v2) {
    return vec(v1.x + v2.x, v1.y + v2.y)
}

function normalizeVec(v, l) {
    let ol = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
    return vec(v.x * l / ol, v.y * l / ol);
}

function sorten(segment, a) {
    //let ret = { start: { x: 0, y: 0 }, end: { x: 50, y: 50 } };
    let start = segment.start
    let end = segment.end

    let v = normalizeVec(vec(start.x - end.x, start.y - end.y), a)
    let _v = vec(-v.x, -v.y)
    return seg(vecAdd(start, _v), vecAdd(end, v));

    //ret = { start: { x: segment.start.x * a + segment.end.x * (1 - a), y: segment.start.y * a + segment.end.y * (1 - a) }, end: { x: segment.end.x * a + segment.start.x * (1 - a), y: segment.end.y * a + segment.start.y * (1 - a) } }

}

function drawSeg(segment, Ox, Oy, h, ctx, size) {
    let scale = h / CharH

    ctx.lineWidth = size
    ctx.beginPath();

    // console.log(segment)
    segment = sorten(segment, 10)
    // console.log(segment)
    let ret = { 
        "start": { 
            "x": Ox + scale * segment.start.x, 
            "y": Oy + scale * segment.start.y 
        },
        "end":{
            "x": Ox + scale * segment.end.x,
            "y": Oy + scale * segment.end.y
        } 
    }

    ctx.moveTo(ret.start.x, ret.start.y);
    ctx.lineTo(ret.end.x, ret.end.y);
    //ctx.closePath();
    ctx.stroke();
    // console.log("draw seg",ret)
    return ret
}

function step() {
    Ox += scale * (CharW + 2 * margin);
}

let trazos = [
    { start: { "x": 0, "y": 0 }, end: { "x": 50, "y": 50 } },
    { start: { "x": 50, "y": 50 }, end: { "x": 100, "y": 0 } },
    { start: { "x": 50, "y": 50 }, end: { "x": 50, "y": 100 } },

    { start: { "x": 50, "y": 100 }, end: { "x": 100, "y": 50 } },
    { start: { "x": 50, "y": 100 }, end: { "x": 100, "y": 100 } },
    { start: { "x": 50, "y": 100 }, end: { "x": 100, "y": 150 } },

    { start: { "x": 50, "y": 100 }, end: { "x": 50, "y": 150 } },
    { start: { "x": 50, "y": 100 }, end: { "x": 0, "y": 150 } },
    { start: { "x": 0, "y": 150 }, end: { "x": 50, "y": 200 } },
    { start: { "x": 50, "y": 200 }, end: { "x": 100, "y": 150 } }
];

function drawChar(x, y, desc, h, ctx, size) {
    let segments = []
    let code = desc;

    for (let t = 0; t < trazos.length; t++) {
        if (desc % 2 != 1) {
            ctx.strokeStyle = "rgb(00,20,20)" // #color 
            segments.push(drawSeg(trazos[t], x, y, h, ctx, size))
        }else{
            ctx.strokeStyle = "#00bebe"// #color
            segments.push(drawSeg(trazos[t], x, y, h, ctx, size))
        }

        desc /= 2;
        desc = Math.floor(desc)
    }
    desc = code
    for (let t = 0; t < trazos.length; t++) {
        if (desc % 2 == 1) {
            ctx.strokeStyle = "#00bebe"// #color
            drawSeg(trazos[t], x, y, h, ctx, size)
        }

        desc /= 2;
        desc = Math.floor(desc)
    }
    // console.log("drawChar",segments)

    return segments
}

function drawText(text, Cx, Cy, maxH, maxW, ctx, mar, size) {

    if(!size){
        size = 10;
    }

    let segs = [];

    ctx.lineCap = "round"
    let h = Math.min(maxH, CharH * (((maxW - mar * (text.length - 1)) / text.length) / CharW))
    let w = h * (CharW / CharH)


    let Oy = Cy - h / 2
    let Ox = Cx - (text.length / 2 * w) - mar * (text.length - 1) / 2
    //console.log("Cx:", Cx, "Cy:", Cy, "maxH", maxH, "maxW", maxW)

    //console.log("h:", h, "w:", w, "Ox", Ox, "Oy", Oy)

    const margin = 0;

    ctx.clearRect(Cx - maxW / 2 - margin, Cy - maxH / 2 - margin, maxW + 2 * margin, maxH + 2 * margin)

    for (let i in text) {
        //console.log(Ox + i * w, Oy, text[i], h)
        segs = segs.concat(drawChar(Ox + i * (w + mar), Oy, text[i], h, ctx, size))
    }
    // console.log("drawText",segs)

    return segs;

}

function slowDrawText(text, Cx, Cy, maxH, maxW, ctx, mar, progress, then, size) {

    let oText = JSON.parse(JSON.stringify({ "a": text })).a;
    let rep = false
    for (let i in text) {
        if (i * 4 > progress) {
            text[i] = rand(0, Math.pow(2, 10))
            rep = true
        }
    }

    drawText(text, Cx, Cy, maxH, maxW, ctx, mar, size)
    if (rep)
        setTimeout(() => {
            slowDrawText(oText, Cx, Cy, maxH, maxW, ctx, mar, progress + 1, then, size)
        }, 100);
    else
        then()

}
