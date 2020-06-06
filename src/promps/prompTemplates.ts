let inquirer = require('inquirer');
const request = require("request-promise");
export class prompTemplates {
    private choices: string[] = new Array();
    private mapaDatos = new Map();
    private url: string = "https://api-tipo-boot.herokuapp.com/topics";
    private tipo: any = null;
    private prompts = [
        {
            type: "list",
            name: "plantillas",
            message: "Seleccione una plantilla:",
            choices: this.choices
        }
    ];

    constructor(tipo:any) {
      this.tipo = tipo;
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
                   this.mapaDatos.set(data[i].id, {nombre: "Template"+ data[i].id,template: "t"+ data[i].id});
                   this.choices.push(data[i].id + ".- " + "Template"+ data[i].id);
                }
            }
            return null;
        },
        (err: any) => {
                console.log(err);
                return null;
        });

        let resp = await inquirer.prompt(this.prompts).then(async (props: any) => {
            let id = props.plantillas.split(".-")[0];
            return this.mapaDatos.get(id).template;
        },
            (err: any) => {
                console.log(err);
                return null;
            }
        );

        return resp;

    }

}
