let TerminalState = "LogIn"

function InitAuthComunications() {
    console.log("we are authorized")
    TerminalState = "Authorized"
    document.getElementById("padlock").style.marginTop = "1000px";
}




// function repeat(t, f) {
//     f()
//     if (t > 0)
//         setTimeout(() => {
//             repeat(t - 1, f)
//         }, 10);

// }