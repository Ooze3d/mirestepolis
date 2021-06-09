import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Jornada } from './jornada.model';
import { MonitorService } from './monitor.service';
import { MonthYear } from 'src/app/monthyear.model';

@Injectable({providedIn: 'root'})
export class JornadaService implements OnInit {

    error:string = '';
    exito:string = '';
    jornada:Jornada = new Jornada(new Date().toISOString(), '00:00', '00:00', '00000000A');
    jornadasList:Jornada[] = [];
    private jornadasListListener = new Subject<Jornada[]>();
    mesesList:MonthYear[] = [];
    monthyear:string = '';
    mes:MonthYear = new MonthYear('01/1970');

    constructor(private http:HttpClient, private monitorService:MonitorService) {
        
    }

    ngOnInit() {
        console.log(this.monthyear);
        if(this.monthyear!='')
            this.getJornadasMes(this.mes.year, this.mes.month);
        else
            this.getJornadasList();
    }

    getJornadasListListener() {
        return this.jornadasListListener;
    }

    getJornadasList() { //Todas las jornadas de un monitor
        this.http.get<Jornada[]>('http://localhost:3000/api/nominas/jornadas/'+this.monitorService.monitor.dni).subscribe((jornadasData) => {
            this.jornadasList = jornadasData;
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        return this.jornadasList;
    }

    getMesesList() {
        this.http.get<MonthYear[]>('http://localhost:3000/api/nominas/'+this.monitorService.monitor.dni).subscribe((mesesData) => {
            this.mesesList = mesesData;
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getJornadasMes(year:number, month:number) { //Days worked by year and month
        this.http.get<Jornada[]>('http://localhost:3000/api/nominas/jornadas/'+this.monitorService.monitor.dni+'/'+year+'/'+month).subscribe((jornadasData) => {
            this.jornadasList = jornadasData;
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getHorasMes() { //Only used inside the paycheck view, when 'month' is already loaded
        let numHoras:number = 0;
        for(let jor of this.jornadasList) {
            numHoras += this.calculaHorasDia(jor);
        }

        return numHoras;
    }

    calculaHorasDia(jor: Jornada) {
        let timeA = new Date("January 1, 1970 "+jor.horaent);
        let timeB = new Date("January 1, 1970 "+jor.horasal);
        let diff =(timeB.getTime() - timeA.getTime()) / 1000;
        diff /= (60 * 60);

        return Math.abs(Math.round(diff));
    }

    updateJornada() {
        this.http.put<{message:string}>('http://localhost:3000/api/nominas/jornadas', this.jornada).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        if(this.monthyear!='')
            this.getJornadasMes(this.mes.year, this.mes.month);
        else
            this.getJornadasList();
    }

    addJornada(fecha:string, horaent:string, horasal:string, dnimonitor:string) {
        this.jornada = new Jornada(fecha, horaent, horasal, dnimonitor);
        this.http.post<{message:string}>('http://localhost:3000/api/nominas/jornadas/new', this.jornada).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });

        if(this.monthyear!='')
            this.getJornadasMes(this.mes.year, this.mes.month);
        else
            this.getJornadasList();

        this.getMesesList();
    }

    deleteJornada() {
        let fecha = this.transformDate(this.jornada.fecha);
        this.http.delete<{message:string}>('http://localhost:3000/api/nominas/jornadas/delete/'+fecha+'/'+this.jornada.dnimonitor).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });

        if(this.monthyear!='')
            this.getJornadasMes(this.mes.year, this.mes.month);
        else
            this.getJornadasList();

        this.getMesesList();
    }

    transformDate(fecha:string) {
        return fecha.split('/').join('-').substr(0,10);
    }

}