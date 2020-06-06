const request = require("request-promise");
import { metadataFuente } from "./../interfaces/metadataFuentes";
const Downloader = require('./../utils/downloader').download;
export class Fuentes {
    private datosFuentes: metadataFuente[];
    private url: string = "https://api-sasf.herokuapp.com/api/fuentes/";
    private usuario: Number;
    constructor(usuario: Number) {
        this.datosFuentes = new Array();
        this.usuario = usuario;
    }

    private async buscarFuentes(): Promise<void> {
        await request({
            uri: this.url + this.usuario,
            json: true
        }).then((data: any) => {
            if (data != null) {
                for (let i = 0; i < data.length; i++) {
                    this.datosFuentes.push({
                        url: data[i].url,
                        tipo: data[i].tipoFuente.nombre
                    });
                }
            }
        })
    }

    public async descargarFuentes() {
        await this.buscarFuentes();
        if (this.datosFuentes.length > 0) {
            let urlFuente = "";
            let nombre = "";
            try {
                for (let i = 0; i < this.datosFuentes.length; i++) {
                    urlFuente = this.datosFuentes[i].url;
                    nombre = this.datosFuentes[i].tipo;
                    Downloader(urlFuente, "src/assets/fonts/"+nombre+".woff2", function () {
                        console.log(`${urlFuente} fuente ${nombre} descargada!!`);
                    });
                }
            } catch (error) {
                console.log(error);
                console.log("Algo salio mal, no se descargaron las fuente " + nombre)
            }

        }
        else {
            console.log("No hay Fuentes a descargar.");
        }

    }
}