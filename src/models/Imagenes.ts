const fss = require('fs');
const imageDownloader = require('./../utils/downloader').download;
export class Imagenes {
    private directorio: string;
    private logoURL: string;
    private splashURL: string;

    constructor(directorio: string, logo: string, splash: string) {
        this.directorio = directorio;
        this.logoURL = logo;
        this.splashURL = splash;
    }

    generarDirectorio() {
        if (!fss.existsSync(this.directorio)) {
            fss.mkdirSync(this.directorio);
            console.log(`Directorio ${this.directorio} creado.`)
        }
        else {
            console.log(`Directorio ${this.directorio} ya existe.`)
        }
    }

    async generarLogos() {
        let logoUrl: string = this.logoURL;
        let directorioR = this.directorio;
        if (logoUrl != "") {
            try {
                await imageDownloader(logoUrl, directorioR + "/icon.png", function () {
                    console.log(`${logoUrl} imagen descargada!!`);
                    console.log(`logo.png creado en directorio ${directorioR}.`)
                });
            } catch (error) {
                console.log(error);
                console.log("No se pudo descargar el logo.");
            }
        }
        if (logoUrl != "") {
            try {
                await imageDownloader(logoUrl, "src/assets/logo.png", function () {
                    console.log(`${logoUrl} imagen descargada!!`);
                    console.log("logo.png creado en directorio assets.")
                });
            } catch (error) {
                console.log(error);
                console.log("No se pudo descargar el logo.");
            }
        }
    }

    async generarFavicon() {
        let logoUrl: string = this.logoURL;
        if (logoUrl != "") {
            try {
                await imageDownloader(logoUrl, "src/assets/icon/favicon.png", function () {
                    console.log(`${logoUrl} favicon descargado!!`);
                    console.log("favicon.png creado en directorio icon.")
                });
            } catch (error) {
                console.log(error);
                console.log("No se pudo descargar el favicon.");
            }
        }
    }

    async generarSplash() {
        let splashUrl: string = this.splashURL;
        let directorioR = this.directorio;
        if (splashUrl != "") {
            try {
                await imageDownloader(splashUrl, directorioR + "/splash.png", function () {
                    console.log(`${splashUrl} imagen descargada!!`);
                    console.log(`logo.png creado en directorio ${directorioR}.`)
                });
            } catch (error) {
                console.log(error);
                console.log("No se pudo descargar el splash screen.");
            }
        }
    }
}