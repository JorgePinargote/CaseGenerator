"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imagenes = void 0;
const fss = require('fs');
const imageDownloader = require('./../utils/downloader').download;
class Imagenes {
    constructor(directorio, logo, splash) {
        this.directorio = directorio;
        this.logoURL = logo;
        this.splashURL = splash;
    }
    generarDirectorio() {
        if (!fss.existsSync(this.directorio)) {
            fss.mkdirSync(this.directorio);
            console.log(`Directorio ${this.directorio} creado.`);
        }
        else {
            console.log(`Directorio ${this.directorio} ya existe.`);
        }
    }
    generarLogos() {
        return __awaiter(this, void 0, void 0, function* () {
            let logoUrl = this.logoURL;
            let directorioR = this.directorio;
            if (logoUrl != "") {
                try {
                    yield imageDownloader(logoUrl, directorioR + "/icon.png", function () {
                        console.log(`${logoUrl} imagen descargada!!`);
                        console.log(`logo.png creado en directorio ${directorioR}.`);
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log("No se pudo descargar el logo.");
                }
            }
            if (logoUrl != "") {
                try {
                    yield imageDownloader(logoUrl, "src/assets/logo.png", function () {
                        console.log(`${logoUrl} imagen descargada!!`);
                        console.log("logo.png creado en directorio assets.");
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log("No se pudo descargar el logo.");
                }
            }
        });
    }
    generarFavicon() {
        return __awaiter(this, void 0, void 0, function* () {
            let logoUrl = this.logoURL;
            if (logoUrl != "") {
                try {
                    yield imageDownloader(logoUrl, "src/assets/icon/favicon.png", function () {
                        console.log(`${logoUrl} favicon descargado!!`);
                        console.log("favicon.png creado en directorio icon.");
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log("No se pudo descargar el favicon.");
                }
            }
        });
    }
    generarSplash() {
        return __awaiter(this, void 0, void 0, function* () {
            let splashUrl = this.splashURL;
            let directorioR = this.directorio;
            if (splashUrl != "") {
                try {
                    yield imageDownloader(splashUrl, directorioR + "/splash.png", function () {
                        console.log(`${splashUrl} imagen descargada!!`);
                        console.log(`logo.png creado en directorio ${directorioR}.`);
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log("No se pudo descargar el splash screen.");
                }
            }
        });
    }
}
exports.Imagenes = Imagenes;
