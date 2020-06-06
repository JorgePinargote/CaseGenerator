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
exports.prompEmpresas = void 0;
let inquirer = require('inquirer');
let request = require("request-promise");
class prompEmpresas {
    constructor() {
        this.url = "https://api-sasf.herokuapp.com/api/empresas/";
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield request({
                uri: this.url,
                json: true
            }).then((data) => {
                return data;
            }, (err) => {
                return null;
            });
        });
    }
    generarPrompts() {
        return __awaiter(this, void 0, void 0, function* () {
            let dat = yield this.findAll().then((data) => {
                if (data != null) {
                    let mapaDatos = new Map();
                    for (let i = 0; i < data.length; i++) {
                        mapaDatos.set("" + data[i].id, data[i]);
                    }
                    return mapaDatos;
                }
                return null;
            }, (err) => {
                console.log(err);
                return null;
            });
            if (dat == null) {
                return null;
            }
            let choices = new Array();
            for (let [clave, valor] of dat) {
                choices.push(clave + ".- " + valor.nombre);
            }
            let prompts = [
                {
                    type: "list",
                    name: "empresas",
                    message: "Seleccione una empresa: ",
                    choices: choices
                }
            ];
            return inquirer.prompt(prompts).then((props) => __awaiter(this, void 0, void 0, function* () {
                //console.log(props.empresas);
                let id = props.empresas.split(".-")[0];
                return dat.get(id);
            }), (err) => {
                console.log(err);
                return null;
            });
        });
    }
}
exports.prompEmpresas = prompEmpresas;
