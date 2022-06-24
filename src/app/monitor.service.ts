import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CampusService } from './campus.service';
import { Constants } from './constants';
import { Monitor } from './monitor.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MonitorService implements OnInit, OnDestroy {

    error: string = '';
    exito: string = '';
    //Dummy info so a database error or a failed refresh can be easily identified
    monitor: Monitor = new Monitor('00000000A', 'Nombre', 'Apellidos', 999111222, 'nombre@mail.com', 'especialidad', 'abc000', 'grupo0');
    monitorList: Monitor[] = [];
    private monitorListener = new Subject<Monitor>();
    private monitorListListener = new Subject<Monitor[]>();
    private errorListener = new Subject<string>();

    destroyed: Subject<void> = new Subject<void>();

    constructor(private http: HttpClient, private campusService: CampusService) {

    }

    ngOnInit() {

    }

    getMonitorListener() {
        return this.monitorListener;
    }

    getMonitorListListener() {
        return this.monitorListListener;
    }

    getErrorListener() {
        return this.errorListener;
    }

    getMonitor(dni: string) {
        this.http.get<Monitor[]>(Constants.url+'monitores/' + dni).pipe(takeUntil(this.destroyed)).subscribe((monitorData) => {
            this.monitor = monitorData[0];
            this.monitorListener.next(this.monitor);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getMonitorList() {
        this.http.get<Monitor[]>(Constants.url+'monitores/campus/' + this.campusService.campus.idcampus).pipe(takeUntil(this.destroyed)).subscribe((monitorData) => {
            this.monitorList = monitorData;
            this.monitorListListener.next(this.monitorList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        return this.monitorList;
    }

    addMonitor(dni: string, nombre: string, apellidos: string, telefono: number, email: string, especialidad: string, idcampus: string, idgrupo: string) {
        this.monitor = new Monitor(dni, nombre, apellidos, telefono, email, especialidad, idcampus, idgrupo);
        this.http.post<{ message: string }>(Constants.url+'monitores/new', this.monitor).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
            this.exito = response.message;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    updateMonitor(dni: string, nombre: string, apellidos: string, telefono: number, email: string, especialidad: string, idcampus: string, idgrupo: string) {
        this.monitor = new Monitor(dni, nombre, apellidos, telefono, email, especialidad, idcampus, idgrupo);
        this.http.put<{ message: string }>(Constants.url+'monitores/update/' + dni, this.monitor).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
            this.exito = response.message;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    updateContra(newContra: string) {
        this.http.put<{ message: string }>(Constants.url+'monitores/newpass/' + this.monitor.dni, [newContra]).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
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
    }

    deleteMonitor(dni: string) {
        this.http.delete<{ message: string }>(Constants.url+'monitores/delete/' + dni).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
            this.exito = response.message;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            this.getMonitorList();
            this.monitorListListener.next(this.monitorList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    horaEnt(fechaEnt: Date) {
        let dia: Date = new Date(fechaEnt);
        dia.setHours(2);
        dia.setMinutes(0);
        dia.setSeconds(0);
        dia.setMilliseconds(0);
        let conjunto = {fecha: dia.toISOString(), horaent: (fechaEnt.getHours()-2)+':'+fechaEnt.getMinutes(), dnimonitor: this.monitor.dni};
        this.http.post<{ message: string }>(Constants.url+'nominas/jornadas/entrada/new', conjunto).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
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
    }

    horaSal(fechaSal: Date) {
        let dia: Date = new Date(fechaSal);
        dia.setHours(2);
        dia.setMinutes(0);
        dia.setSeconds(0);
        dia.setMilliseconds(0);
        let conjunto = {fecha: dia.toISOString(), horasal: (fechaSal.getHours()-2)+':'+fechaSal.getMinutes(), dnimonitor: this.monitor.dni};
        this.http.put<{ message: string }>(Constants.url+'nominas/jornadas/salida/new', conjunto).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.error = '';
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
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
      }

}