let inquirer = require('inquirer');
const request = require("request-promise");
export class prompTipoTemplates {
    private choices: string[] = new Array();
    private mapaDatos = new Map();
    private url: string = "https://api-tipo-boot.herokuapp.com/topics";

    private prompts = [
        {
            type: "list",
            name: "tipos",
            message: "Seleccione un tipo de plantilla:",
            choices: this.choices
        }
    ];

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
        await this.findAll().then((data: any) => {
            if (data != null) {
                for (let i = 0; i < data.length; i++) {
                   this.mapaDatos.set(data[i].id, {data: data[i]});
                   this.choices.push(data[i].id + ".- " +  data[i].name);
                }
            }
            return null;
        },
        (err: any) => {
                console.log(err);
                return null;
        });

        let resp = await inquirer.prompt(this.prompts).then(async (props: any) => {
            let id = props.tipos.split(".-")[0];
            return this.mapaDatos.get(id);
        },
            (err: any) => {
                console.log(err);
                return null;
            }
        );

        return resp;

    }

}
