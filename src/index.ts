const fss = require('fs');
//const request = require('request');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

//imports personalizados
import { prompLogin } from "./promps/prompLogin";
import { prompDatosAutor } from "./promps/prompDatosAutor";
import { metadataGenerador } from "./interfaces/metadataGenerador";
import { generadorIonic } from "./generadores/generadorIonic";
import { colores } from "./models/colores";
import { prompEmpresas } from "./promps/prompEmpresas";
import { prompTemplates } from "./promps/prompTemplates";
import { prompTipoTemplates } from "./promps/prompTipoTemplates";
import { Fuentes } from "./models/fuentes";
import { Imagenes } from "./models/Imagenes";

//variables personalizadas
const respLogin = null;
const respDatosAutor = null;
const respEmpresa = null;
const plantilla: any = null;
const tipoplantilla: any = null;
const jsonDatos:any = null;


module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Bienvenidos a ${chalk.red('generator-cli-sasf')}!`)
    );
    //promt de login
    let protLogin: prompLogin = new prompLogin();
    this.respLogin = await protLogin.generarPrompts();
    if (this.respLogin.status) {
      //selección de tipo plantilla
      let prompsTipoPlantilla: prompTipoTemplates = new prompTipoTemplates();
      this.tipoplantilla = await prompsTipoPlantilla.generarPrompts();
      if(this.tipoplantilla != null){
        let prompsPlantilla: prompTemplates = new prompTemplates(this.tipoplantilla);
        this.plantilla = await prompsPlantilla.generarPrompts();
      if (this.plantilla != null) {
        //selección de empresa
        let empresa: prompEmpresas = new prompEmpresas();
        this.respEmpresa = await empresa.generarPrompts();
        if (this.respEmpresa != null) {
          //datos de autor
          let protDatosAutor: prompDatosAutor = new prompDatosAutor(this.appname);
          this.respDatosAutor = await protDatosAutor.generarPrompts();
          let color: colores = new colores(this.respEmpresa.id);
          this.jsonDatos = await color.generarColores();
        }
        else {
          this.respLogin.status = false;
        }
      }
     }
    }
    return;
  }

  writing() {
    if (this.respLogin.status && this.plantilla != null && this.tipoplantilla != null ) {
      //let fontUrl: string = "";
      let nombreEmpresa = this.respEmpresa.nombre.replace(/ /g, "");
      //se agregan archivos personalizados
      console.log("Generando proyecto de ionic");
      let genIonic: generadorIonic = new generadorIonic(this.tipoplantilla.data.name, this.plantilla);
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
      let datosEscribirArray: metadataGenerador[] = new Array();
      datosEscribirArray = genIonic.obtenerArchivos();
      //se procede a copiar los archivos de la plantilla
      for (let i = 0; i < datosEscribirArray.length; i++) {
        if (datosEscribirArray[i].adicional == null) {
          this.fs.copy(
            this.templatePath(datosEscribirArray[i].origen),
            this.destinationPath(datosEscribirArray[i].destino)
          );
        }
        else {
          this.fs.copyTpl(
            this.templatePath(datosEscribirArray[i].origen),
            this.destinationPath(datosEscribirArray[i].destino), datosEscribirArray[i].adicional
          );
        }
      }

      let imagen: Imagenes = new Imagenes("resources", this.respEmpresa.logo, this.respEmpresa.splash);
      //creando directorio resources si no existe
      imagen.generarDirectorio();

      //copiado de logo
      imagen.generarLogos();

      //copiado de favicon
      imagen.generarFavicon();

      //copiado de splash
      imagen.generarSplash();

      //descargando fuentes
      let fuentes: Fuentes = new Fuentes(this.respEmpresa.id);
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
