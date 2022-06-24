import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Jornada } from './jornada.model';
import { MonitorService } from './monitor.service';
import { MonthYear } from 'src/app/monthyear.model';
import { Constants } from './constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class JornadaService implements OnInit, OnDestroy {

    error:string = '';
    exito:string = '';
    jornada:Jornada = new Jornada(new Date().toISOString(), '00:00', '00:00', '00000000A');
    jornadasList:Jornada[] = [];
    private jornadasListListener = new Subject<Jornada[]>();
    mesesList:MonthYear[] = [];
    monthyear:string = '';
    mes:MonthYear = new MonthYear('01/1970');
    destroyed: Subject<void> = new Subject<void>();
    jornadaIn: boolean = false;
    private jornadaInListener = new Subject<boolean>();
    jornadaOut: boolean = false;
    private jornadaOutListener = new Subject<boolean>();

    constructor(private http:HttpClient, private monitorService:MonitorService) {
        
    }

    ngOnInit() {
        if(this.monthyear!='')
                this.getJornadasMes(this.mes.year, this.mes.month);
            else
                this.getJornadasList();
        this.jornadasListListener.next(this.jornadasList);
    }

    getJornadasListListener() {
        return this.jornadasListListener;
    }

    getJornadaInListener() {
        return this.jornadaInListener;
    }

    getJornadaOutListener() {
        return this.jornadaOutListener;
    }

    getJornadasList() { //Todas las jornadas de un monitor
        this.http.get<Jornada[]>(Constants.url+'nominas/jornadas/'+this.monitorService.monitor.dni).pipe(takeUntil(this.destroyed)).subscribe((jornadasData) => {
            this.jornadasList = jornadasData;
            this.jornadasListListener.next(this.jornadasList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        return this.jornadasList;
    }

    getMesesList() {
        this.http.get<MonthYear[]>(Constants.url+'nominas/'+this.monitorService.monitor.dni).pipe(takeUntil(this.destroyed)).subscribe((mesesData) => {
            this.mesesList = mesesData;
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getJornadasMes(year:number, month:number) { //Days worked by year and month
        this.http.get<Jornada[]>(Constants.url+'nominas/jornadas/'+this.monitorService.monitor.dni+'/'+year+'/'+month).pipe(takeUntil(this.destroyed)).subscribe((jornadasData) => {
            this.jornadasList = jornadasData;
            this.jornadasListListener.next(this.jornadasList);
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
        this.http.put<{message:string}>(Constants.url+'nominas/jornadas', this.jornada).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            if(this.monthyear!='')
                this.getJornadasMes(this.mes.year, this.mes.month);
            else
                this.getJornadasList();
            this.jornadasListListener.next(this.jornadasList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });

    }

    addJornada(fecha:string, horaent:string, horasal:string, dnimonitor:string) {
        this.jornada = new Jornada(fecha, horaent, horasal, dnimonitor);
        this.http.post<{message:string}>(Constants.url+'nominas/jornadas/new', this.jornada).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            if(this.monthyear!='')
                this.getJornadasMes(this.mes.year, this.mes.month);
            else
                this.getJornadasList();
            this.jornadasListListener.next(this.jornadasList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    deleteJornada() {
        let fecha = this.transformDate(this.jornada.fecha);
        this.http.delete<{message:string}>(Constants.url+'nominas/jornadas/delete/'+fecha+'/'+this.jornada.dnimonitor).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            if(this.monthyear!='')
                this.getJornadasMes(this.mes.year, this.mes.month);
            else
                this.getJornadasList();
            this.jornadasListListener.next(this.jornadasList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    checkJornadaIn() {
        let fecha = this.transformDate(this.jornada.fecha);
        this.http.get<{message: string}>(Constants.url+'nominas/jornadas/check/in/'+fecha+'/'+this.monitorService.monitor.dni).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.jornadaIn = response.message=='true';
            this.jornadaInListener.next(this.jornadaIn);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    checkJornadaOut() {
        let fecha = this.transformDate(this.jornada.fecha);
        this.http.get<{message: string}>(Constants.url+'nominas/jornadas/checkout/monitor/personal/'+fecha+'/'+this.monitorService.monitor.dni).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.jornadaOut = response.message=='true';
            this.jornadaOutListener.next(this.jornadaOut);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    transformDate(fecha:string) {
        return fecha.split('/').join('-').substr(0,10);
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
      }

}