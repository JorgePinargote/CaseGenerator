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
const fss = require('fs');
//const request = require('request');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
//imports personalizados
const prompLogin_1 = require("./promps/prompLogin");
const prompDatosAutor_1 = require("./promps/prompDatosAutor");
const generadorIonic_1 = require("./generadores/generadorIonic");
const colores_1 = require("./models/colores");
const prompEmpresas_1 = require("./promps/prompEmpresas");
const prompTemplates_1 = require("./promps/prompTemplates");
const prompTipoTemplates_1 = require("./promps/prompTipoTemplates");
const fuentes_1 = require("./models/fuentes");
const Imagenes_1 = require("./models/Imagenes");
//variables personalizadas
const respLogin = null;
const respDatosAutor = null;
const respEmpresa = null;
const plantilla = null;
const tipoplantilla = null;
const jsonDatos = null;
module.exports = class extends Generator {
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            // Have Yeoman greet the user.
            this.log(yosay(`Bienvenidos a ${chalk.red('generator-cli-sasf')}!`));
            //promt de login
            let protLogin = new prompLogin_1.prompLogin();
            this.respLogin = yield protLogin.generarPrompts();
            if (this.respLogin.status) {
                //selección de tipo plantilla
                let prompsTipoPlantilla = new prompTipoTemplates_1.prompTipoTemplates();
                this.tipoplantilla = yield prompsTipoPlantilla.generarPrompts();
                if (this.tipoplantilla != null) {
                    let prompsPlantilla = new prompTemplates_1.prompTemplates(this.tipoplantilla);
                    this.plantilla = yield prompsPlantilla.generarPrompts();
                    if (this.plantilla != null) {
                        //selección de empresa
                        let empresa = new prompEmpresas_1.prompEmpresas();
                        this.respEmpresa = yield empresa.generarPrompts();
                        if (this.respEmpresa != null) {
                            //datos de autor
                            let protDatosAutor = new prompDatosAutor_1.prompDatosAutor(this.appname);
                            this.respDatosAutor = yield protDatosAutor.generarPrompts();
                            let color = new colores_1.colores(this.respEmpresa.id);
                            this.jsonDatos = yield color.generarColores();
                        }
                        else {
                            this.respLogin.status = false;
                        }
                    }
                }
            }
            return;
        });
    }
    writing() {
        if (this.respLogin.status && this.plantilla != null && this.tipoplantilla != null) {
            //let fontUrl: string = "";
            let nombreEmpresa = this.respEmpresa.nombre.replace(/ /g, "");
            //se agregan archivos personalizados
            console.log("Generando proyecto de ionic");
            let genIonic = new generadorIonic_1.generadorIonic(this.tipoplantilla.data.name, this.plantilla);
            genIonic.addDatoConAdicional("_capacitor.config.json", "capacitor.config.json", {
                appName: this.respDatosAutor.proyecto
            });
            genIonic.addDatoConAdicional("_package-lock.json", "package-lock.json", {
                appName: this.respDatosAutor.proyecto,
                empresa: nombreEmpresa
            });
            genIonic.addDatoConAdicional("_package.json", "package.json", {
                appName: this.respDatosAutor.proyecto,
                repositorio: this.respDatosAutor.repositorio,
                descripcion: this.respDatosAutor.descripcion,
                autor: this.respDatosAutor.autor,
                empresa: nombreEmpresa
            });
            genIonic.addDatoConAdicional("src/theme/variables.scss", "src/theme/variables.scss", this.jsonDatos);
            let datosEscribirArray = new Array();
            datosEscribirArray = genIonic.obtenerArchivos();
            //se procede a copiar los archivos de la plantilla
            for (let i = 0; i < datosEscribirArray.length; i++) {
                if (datosEscribirArray[i].adicional == null) {
                    this.fs.copy(this.templatePath(datosEscribirArray[i].origen), this.destinationPath(datosEscribirArray[i].destino));
                }
                else {
                    this.fs.copyTpl(this.templatePath(datosEscribirArray[i].origen), this.destinationPath(datosEscribirArray[i].destino), datosEscribirArray[i].adicional);
                }
            }
            let imagen = new Imagenes_1.Imagenes("resources", this.respEmpresa.logo, this.respEmpresa.splash);
            //creando directorio resources si no existe
            imagen.generarDirectorio();
            //copiado de logo
            imagen.generarLogos();
            //copiado de favicon
            imagen.generarFavicon();
            //copiado de splash
            imagen.generarSplash();
            //descargando fuentes
            let fuentes = new fuentes_1.Fuentes(this.respEmpresa.id);
            fuentes.descargarFuentes();
        }
    }
    install() {
        if (this.respLogin.status && this.plantilla != null) {
            this.npmInstall(['tsd'], { 'global': true });
            this.npmInstall();
        }
    }
};
