import { Alergia } from "./alergia.model";
import { Familiar } from "./familiar.model";
import { Pago } from "./pago.model";
import { Dia } from "./dia.model";
import { Trastorno } from "./trastorno.model";

export class Inscripcion {

    public matricula: string = '';
    public alergias:Alergia[] = [];
    public trastornos:Trastorno[] = [];
    public famList:Familiar[] = [];
    public payList: Pago[] = [];
    public dayList: Dia[] = [];

    constructor(public nombre:string, public apellidos:string, public fechanac:string, public pagada:number, public regalada:number, public idgrupo:string) { }

}