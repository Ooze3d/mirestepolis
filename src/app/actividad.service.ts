import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Actividad } from './actividad.model';
import { CampusService } from './campus.service';

@Injectable({ providedIn: 'root' })
export class ActividadService implements OnInit {

    fecha: Date = new Date();
    actividad: Actividad = new Actividad('nombre', 'descripcion', new Date().toISOString(), new Date().toISOString(), '#FFADAD', 'abc000', '00000000A');
    actividadList: Actividad[] = [];
    private actividadListener = new Subject<Actividad>();
    error:string = '';
    private errorListener = new Subject<string>();

    constructor(private http: HttpClient, private campusService: CampusService) {

    }

    ngOnInit() {

    }


    getActividadListener() {
        return this.actividadListener;
    }


    getErrorListener() {
        return this.errorListener;
    }

    getActividad(idactividad: number) {
        this.http.get<Actividad[]>('http://localhost:3000/api/actividades/' + this.campusService.campus.idcampus).subscribe((actividadData) => {
            this.actividadList = actividadData;
        }, error => {
            console.log(error);
        });
    }

    getActividadList() {
        this.http.get<Actividad[]>('http://localhost:3000/api/actividades/campus/' + this.campusService.campus.idcampus).subscribe((actividadData) => {
            this.actividadList = actividadData;
        }, error => {
            console.log(error);
        });
        return this.actividadList;
    }

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
            this.http.post<JSON>('http://localhost:3000/api/actividades/new', this.actividad).subscribe(response => {
                console.log(response);
                this.error = '';
                this.errorListener.next(this.error);
            }, error => {
                console.log(error);
                this.error = error.error.message;
                this.errorListener.next(this.error);
            });
            this.getActividadList();
        }
    }

    updateActividad() {

    }

    deleteActividad(idactividad: number) {
        this.http.delete<JSON>('http://localhost:3000/api/actividades/delete/' + idactividad).subscribe(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });
        this.getActividadList();
    }

}