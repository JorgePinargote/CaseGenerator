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
exports.Fuentes = void 0;
const request = require("request-promise");
const Downloader = require('./../utils/downloader').download;
class Fuentes {
    constructor(usuario) {
        this.url = "https://api-sasf.herokuapp.com/api/fuentes/";
        this.datosFuentes = new Array();
        this.usuario = usuario;
    }
    buscarFuentes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield request({
                uri: this.url + this.usuario,
                json: true
            }).then((data) => {
                if (data != null) {
                    for (let i = 0; i < data.length; i++) {
                        this.datosFuentes.push({
                            url: data[i].url,
                            tipo: data[i].tipoFuente.nombre
                        });
                    }
                }
            });
        });
    }
    descargarFuentes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buscarFuentes();
            if (this.datosFuentes.length > 0) {
                let urlFuente = "";
                let nombre = "";
                try {
                    for (let i = 0; i < this.datosFuentes.length; i++) {
                        urlFuente = this.datosFuentes[i].url;
                        nombre = this.datosFuentes[i].tipo;
                        Downloader(urlFuente, "src/assets/fonts/" + nombre + ".woff2", function () {
                            console.log(`${urlFuente} fuente ${nombre} descargada!!`);
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log("Algo salio mal, no se descargaron las fuente " + nombre);
                }
            }
            else {
                console.log("No hay Fuentes a descargar.");
            }
        });
    }
}
exports.Fuentes = Fuentes;
