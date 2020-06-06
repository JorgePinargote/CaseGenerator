"use strict";
const fsdl = require('fs');
var downloadLocal = function (uriLocal) {
    let fileUrl = new URL(uriLocal);
    try {
        let data = fsdl.readFileSync(fileUrl);
        fsdl.writeFileSync("resources/logo.png", data);
        console.log("Logo copiado.");
    }
    catch (error) {
        console.log(error);
        console.log("No se pudo copiar la imagen.");
    }
};
module.exports = {
    downloadLocal
};
