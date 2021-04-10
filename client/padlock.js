function padlockOnLoad(){

    console.log("drawing title")

    let canvasTitle = document.getElementById("padlockTitleCanvas")
    canvasTitle.height = 1000
    canvasTitle.width = 7000

    console.log(canvasTitle.height, canvasTitle.width)

    draw([0, 1, 2, 3, 4], 0, 0, canvasTitle.getContext('2d'),canvasTitle.height, canvasTitle.width)

}
