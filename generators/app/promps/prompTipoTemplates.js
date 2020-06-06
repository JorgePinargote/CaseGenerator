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
exports.prompTipoTemplates = void 0;
let inquirer = require('inquirer');
const request = require("request-promise");
class prompTipoTemplates {
    constructor() {
        this.choices = new Array();
        this.mapaDatos = new Map();
        this.url = "https://api-tipo-boot.herokuapp.com/topics";
        this.prompts = [
            {
                type: "list",
                name: "tipos",
                message: "Seleccione un tipo de plantilla:",
                choices: this.choices
            }
        ];
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
            yield this.findAll().then((data) => {
                if (data != null) {
                    for (let i = 0; i < data.length; i++) {
                        this.mapaDatos.set(data[i].id, { data: data[i] });
                        this.choices.push(data[i].id + ".- " + data[i].name);
                    }
                }
                return null;
            }, (err) => {
                console.log(err);
                return null;
            });
            let resp = yield inquirer.prompt(this.prompts).then((props) => __awaiter(this, void 0, void 0, function* () {
                let id = props.tipos.split(".-")[0];
                return this.mapaDatos.get(id);
            }), (err) => {
                console.log(err);
                return null;
            });
            return resp;
        });
    }
}
exports.prompTipoTemplates = prompTipoTemplates;
