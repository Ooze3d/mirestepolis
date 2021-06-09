import { Alergia } from "./alergia.model";
import { Familiar } from "./familiar.model";
import { Trastorno } from "./trastorno.model";

export class Inscripcion {

    public matricula: string = '';
    public alergias:Alergia[] = [];
    public trastornos:Trastorno[] = [];
    public famList:Familiar[] = [];

    constructor(public nombre:string, public apellidos:string, public fechanac:string, public pagada:number, public regalada:number, public idgrupo:string) { }

}