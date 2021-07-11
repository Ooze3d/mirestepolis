import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Actividad } from './actividad.model';
import { CampusService } from './campus.service';
import { Constants } from './constants';

@Injectable({ providedIn: 'root' })
export class ActividadService implements OnInit {

    error: string = '';
    exito: string = '';
    fecha: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000)); //Compensando la zona horaria
    actividad: Actividad = new Actividad('nombre', 'descripcion', new Date().toISOString(), new Date().toISOString(), '#FFADAD', 'abc000', '00000000A');
    actividadList: Actividad[] = [];
    allActividadList: Actividad[] = [];
    monitorActividadList: Actividad[] = [];
    private actividadListener = new Subject<Actividad>();
    private actividadListListener = new Subject<Actividad[]>();
    private allActividadListListener = new Subject<Actividad[]>();
    private monitorActividadListListener = new Subject<Actividad[]>();
    private errorListener = new Subject<string>();

    constructor(private http: HttpClient, private campusService: CampusService) {

    }

    ngOnInit() {

    }

    getActividadListener() {
        return this.actividadListener;
    }

    getActividadListListener() {
        return this.actividadListListener;
    }

    getAllActividadListListener() {
        return this.allActividadListListener;
    }

    getMonitorActividadListListener() {
        return this.monitorActividadListListener;
    }

    getErrorListener() {
        return this.errorListener;
    }

    getActividad(idactividad: number) {
        this.http.get<Actividad[]>(Constants.url+'actividades/' + idactividad).subscribe((actividadData) => {
            this.actividad = actividadData[0];
            this.actividadListener.next(this.actividad);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getActividadList() {
        this.http.get<Actividad[]>(Constants.url+'actividades/campus/' + this.campusService.campus.idcampus + '/' + this.fecha.toISOString().substr(0, 10)).subscribe((actividadData) => {
            this.actividadList = actividadData;
            this.actividadListListener.next(this.actividadList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getActividadListMonitor(dni: string, fecha: Date) {
        this.http.get<Actividad[]>(Constants.url+'actividades/monitor/' + dni + '/' + fecha.toISOString().substr(0, 10)).subscribe((actividadData) => {
            this.monitorActividadList = actividadData;
            this.monitorActividadListListener.next(this.monitorActividadList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getAllActividadList() {
        this.http.get<Actividad[]>(Constants.url+'actividades').subscribe((actividadData) => {
            this.allActividadList = actividadData;
            this.allActividadListListener.next(this.allActividadList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }


    /*
        Angular automatically checks for the timezone offset and applies it, but the server doesn't take that offset into account and always saves it to the database
        as the same date, two hours before. For now, we manually compensate for that error.
    */

    addActividad(nombre: string, descripcion: string, horaini: string, minini: string, horafin: string, minfin: string, color: string, idgrupo: string, dnimonitor: string) {
        let fechaIni: Date = new Date(this.fecha.setHours(Number(horaini) + 2));
        fechaIni.setMinutes(Number(minini));
        fechaIni.setSeconds(0);
        fechaIni.setUTCMilliseconds(0);
        let fechaFin: Date = new Date(this.fecha.setHours(Number(horafin) + 2));
        fechaFin.setMinutes(Number(minfin));
        fechaFin.setSeconds(0);
        fechaFin.setMilliseconds(0);
        if (fechaFin <= fechaIni) {
            this.error = 'La hora de fin no puede ser menor que la de inicio';
            this.errorListener.next(this.error);
        } else {
            this.actividad = new Actividad(nombre, descripcion, fechaIni.toISOString(), fechaFin.toISOString(), color, idgrupo, dnimonitor);
            this.http.post<{ message: string }>(Constants.url+'actividades/new', this.actividad).subscribe(response => {
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
            this.getActividadList();
        }
    }

    updateActividad(idactividad: number, nombre: string, descripcion: string, horaini: string, minini: string, horafin: string, minfin: string, color: string, idgrupo: string, dnimonitor: string) {
        let fechaIni: Date = new Date(this.fecha.setHours(Number(horaini) + 2));
        fechaIni.setMinutes(Number(minini));
        fechaIni.setSeconds(0);
        fechaIni.setUTCMilliseconds(0);
        let fechaFin: Date = new Date(this.fecha.setHours(Number(horafin) + 2));
        fechaFin.setMinutes(Number(minfin));
        fechaFin.setSeconds(0);
        fechaFin.setMilliseconds(0);
        if (fechaFin <= fechaIni) {
            this.error = 'La hora de fin no puede ser menor que la de inicio';
            this.errorListener.next(this.error);
        } else {
            this.actividad = new Actividad(nombre, descripcion, fechaIni.toISOString(), fechaFin.toISOString(), color, idgrupo, dnimonitor);
            this.actividad.idactividad = idactividad;
            this.http.put<{ message: string }>(Constants.url+'actividades/update/' + idactividad, this.actividad).subscribe(response => {
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
            this.getActividadList();
        }
    }

    deleteActividad(idactividad: number) {
        this.http.delete<{ message: string }>(Constants.url+'actividades/delete/' + idactividad).subscribe(response => {
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
        this.getActividadList();
    }

}