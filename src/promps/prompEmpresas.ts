let inquirer = require('inquirer');
let request = require("request-promise")
export class prompEmpresas {
    private url: string = "https://api-sasf.herokuapp.com/api/empresas/";

    constructor() {

    }

    private async findAll(): Promise<any> {
        return await request({
            uri: this.url,
            json: true
        }).then((data: any) => {
            return data;
        }, (err: any) => {
            return null;
        });
    }

    async generarPrompts() {
        let dat: any = await this.findAll().then((data: any) => {
            if (data != null) {
                let mapaDatos = new Map();
                for (let i = 0; i < data.length; i++) {
                    mapaDatos.set(""+data[i].id, data[i]);
                }
                return mapaDatos;
            }
            return null;
        },
        (err: any) => {
                console.log(err);
                return null;
        });

        if(dat == null){
            return null;
        }

        let choices: string[] = new Array();
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
        ]

        return inquirer.prompt(prompts).then(async (props: any) => {
            //console.log(props.empresas);
            let id = props.empresas.split(".-")[0];
            return dat.get(id);
        },
        (err:any) => {
            console.log(err);
            return null;
        }
        );

    }

}
