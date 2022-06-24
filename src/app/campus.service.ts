import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Campus } from './campus.model';
import { Constants } from './constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
 
@Injectable({providedIn: 'root'})
export class CampusService implements OnInit, OnDestroy {

    exito:string = '';
    error:string = '';
    campus:Campus = new Campus('abc000', 'Campus de Prueba', 'Dirección de prueba', new Date().toISOString(), new Date().toISOString());
    campusList:Campus[] = [];
    gruposList:{idgrupo:string, nombre:string}[] = [];
    private campusListener = new Subject<Campus>();
    private campusListListener = new Subject<Campus[]>();
    private gruposListener = new Subject<{idgrupo:string, nombre:string}[]>();
    daysList:Date[] = [];
    mesesList: { numero: number, texto: string }[] = [];
    destroyed: Subject<void> = new Subject<void>();

    constructor(private http:HttpClient) {

    }

    ngOnInit() {
        
    }

    getCampusListener() {
        return this.campusListener;
    }

    getCampusListListener() {
        return this.campusListListener;
    }

    getGruposListener() {
        return this.gruposListener;
    }

    getCampus(idcampus:string) {
        this.http.get<Campus[]>(Constants.url+'campus/'+idcampus).pipe(takeUntil(this.destroyed)).subscribe((campusData) => {
            this.campus = campusData[0];
            let ini: Date = new Date(this.campus.fechaini);
            ini.setHours(ini.getHours() + 2);
            let fin:Date = new Date(this.campus.fechafin);
            fin.setHours(fin.getHours() + 2);
            this.campus.fechaini = ini.toISOString();
            this.campus.fechafin = fin.toISOString();
            this.campusListener.next(this.campus);
            this.getGruposList();
            this.getDiasList();
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getCampusList() {
        this.http.get<Campus[]>(Constants.url+'campus').pipe(takeUntil(this.destroyed)).subscribe((campusData) => {
            this.campusList = campusData;
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        return this.campusList;
    }

    getGruposList() {
        this.http.get<{idgrupo:string, nombre:string}[]>(Constants.url+'campus/grupos/'+this.campus.idcampus).pipe(takeUntil(this.destroyed)).subscribe((gruposData) => {
            this.gruposList = gruposData;
            this.gruposListener.next(this.gruposList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getDiasList() {
        let dia: Date = new Date(this.campus.fechaini);
        let mes: number = dia.getMonth();
        let lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.daysList = [];
        do {
            if(this.mesesList.find(x => x.texto == lista[mes])==undefined) {
                this.mesesList.push({numero: mes+1, texto:lista[mes]});
            }
            this.daysList.push(dia);
            dia = new Date(dia.getTime()+24*60*60*1000);
            mes = dia.getMonth();
        } while(dia.getTime()<=new Date(this.campus.fechafin).getTime());
    }

    addCampus(nombre:string, direccion:string, fechaini:Date, fechafin:Date) {
        const idcampus:string = nombre.toLowerCase().substr(0,3)+Math.round(Math.random()*899+100); //Auto ID
        this.campus = new Campus(idcampus, nombre, direccion, fechaini.toISOString(), fechafin.toISOString());
        this.http.post<{ message: string }>(Constants.url+'campus/new', this.campus).pipe(takeUntil(this.destroyed)).subscribe(response => {
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
        this.getCampusList();
        this.campusListListener.next(this.campusList);
    }

    updateCampus(idcampus:string, nombre:string, direccion:string, fechaini:Date, fechafin:Date) {
        this.campus = new Campus(idcampus, nombre, direccion, fechaini.toISOString(), fechafin.toISOString());
        this.http.put<{ message: string }>(Constants.url+'campus/update/'+idcampus, this.campus).pipe(takeUntil(this.destroyed)).subscribe(response => {
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
        this.campusListener.next(this.campus);
    }

    deleteCampus(idcampus:string) {
        this.http.delete<{ message: string }>(Constants.url+'campus/delete/'+idcampus).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getCampusList();
            this.campusListListener.next(this.campusList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = error.error.error;
            this.getCampusList();
            this.campusListListener.next(this.campusList);
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