let AuthKey = ""

let TerminalState = "LogIn"

function InitAuthComunications() {
    console.log("stuff is happening ", AuthKey)
    TerminalState = "Authorized"
    repeat(100, resizePadlock)
}

function loadScript() {
    console.log("loaded")
}

function repeat(t, f) {
    f()
    if (t > 0)
        setTimeout(() => {
            repeat(t - 1, f)
        }, 10);

}