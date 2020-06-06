let inquirer = require('inquirer');
const request = require("request-promise");
export class prompLogin {
    private usuario: number;
    private clave: string;
    private url: string = "https://api-sasf.herokuapp.com/api/login/";
    private prompts = [
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

    constructor() {
        this.usuario = 0;
        this.clave = "";
    }

    private async findById(id: any, clave: string): Promise<any> {
        return await request({
            uri: this.url + id,
            json: true,
            body: {
                clave: clave
            }
        }).then((data: any) => {
            return data;
        }, (err: any) => {
            return null;
        });
    }


    generarPrompts() {
        return inquirer.prompt(this.prompts).then(async (props: any) => {
            let dt: any = null;
            let colors: any = null;
            let usuario = {
                user: Number(0),
                clave: "",
                status: false,
                data: dt,
                colores: colors
            }
            this.usuario = props.usuario;
            this.clave = props.clave;

            await this.findById(this.usuario, this.clave).then((dat: any) => {
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
                console.log("Credenciales invalidas, verifique usuario y clave 2.")
            }
            return usuario;
        });
    }

}
