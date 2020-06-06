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
exports.prompLogin = void 0;
let inquirer = require('inquirer');
const request = require("request-promise");
class prompLogin {
    constructor() {
        this.url = "https://api-sasf.herokuapp.com/api/login/";
        this.prompts = [
            {
                type: "input",
                name: "usuario",
                message: "Nombre de usuario: ",
            },
            {
                type: "password",
                name: "clave",
                message: "Ingrese su clave: "
            }
        ];
        this.usuario = 0;
        this.clave = "";
    }
    findById(id, clave) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield request({
                uri: this.url + id,
                json: true,
                body: {
                    clave: clave
                }
            }).then((data) => {
                return data;
            }, (err) => {
                return null;
            });
        });
    }
    generarPrompts() {
        return inquirer.prompt(this.prompts).then((props) => __awaiter(this, void 0, void 0, function* () {
            let dt = null;
            let colors = null;
            let usuario = {
                user: Number(0),
                clave: "",
                status: false,
                data: dt,
                colores: colors
            };
            this.usuario = props.usuario;
            this.clave = props.clave;
            yield this.findById(this.usuario, this.clave).then((dat) => {
                if (dat != null) {
                    usuario.data = dat;
                }
            });
            usuario.user = this.usuario;
            usuario.clave = this.clave;
            if (usuario.data != null) {
                usuario.status = true;
            }
            else {
                console.log("Credenciales invalidas, verifique usuario y clave 2.");
            }
            return usuario;
        }));
    }
}
exports.prompLogin = prompLogin;
