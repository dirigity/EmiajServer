const fs = require("fs")

function save_intern(file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
}

function load_intern(file) {
    return JSON.parse(fs.readFileSync(file))
}

module.exports = {
    "save": (file, data) => {
        save_intern(file, data)
    },
    "load": (file) => {
        return load_intern(file)
    }
}

