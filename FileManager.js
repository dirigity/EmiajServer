const fs = require("fs")

function save_intern(file, data) {
    // console.log(file,data)
    // var stack = new Error().stack
    // console.log(stack)
    fs.writeFileSync(file, data);
}

function load_intern(file) {
    return fs.readFileSync(file)
}

function saveJSON_intern(file, data) {
    save_intern(file, JSON.stringify(data,null,2));
}

function loadJSON_intern(file) {
    return JSON.parse(load_intern(file))
}

module.exports = {
    "save": (file, data) => {
        save_intern(file, data)
    },
    "load": (file) => {
        return load_intern(file)
    }, 
    "saveJSON": (file, data) => {
        saveJSON_intern(file, data)
    },
    "loadJSON": (file) => {
        return loadJSON_intern(file)
    }
}

