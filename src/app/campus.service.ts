import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Campus } from './campus.model';
 
@Injectable({providedIn: 'root'})
export class CampusService implements OnInit {

    campus:Campus = new Campus('abc000', 'Campus de Prueba', 'Dirección de prueba', new Date().toISOString(), new Date().toISOString());
    campusList:Campus[] = [];
    gruposList:{idgrupo:string, nombre:string}[] = [];
    private campusListener = new Subject<Campus>();
    private gruposListener = new Subject<{idgrupo:string, nombre:string}[]>();

    constructor(private http:HttpClient) {

    }

    ngOnInit() {
        
    }

    getCampusListener() {
        return this.campusListener;
    }

    getGruposListener() {
        return this.gruposListener;
    }

    getCampus(idcampus:string) {
        this.http.get<Campus[]>('http://localhost:3000/api/campus/'+idcampus).subscribe((campusData) => {
            this.campus = campusData[0];
            this.campusListener.next(this.campus);
        }, error => {
            console.log(error);
        });
        this.getGruposList();
    }

    getCampusList() {
        this.http.get<Campus[]>('http://localhost:3000/api/campus').subscribe((campusData) => {
            this.campusList = campusData;
        }, error => {
            console.log(error);
        });
        return this.campusList;
    }

    getGruposList() {
        this.http.get<{idgrupo:string, nombre:string}[]>('http://localhost:3000/api/campus/grupos/'+this.campus.idcampus).subscribe((gruposData) => {
            this.gruposList = gruposData;
            this.gruposListener.next(this.gruposList);
        }, error => {
            console.log(error);
        });
    }

    addCampus(nombre:string, direccion:string, fechaini:Date, fechafin:Date) {
        const idcampus:string = nombre.toLowerCase().substr(0,3)+Math.round(Math.random()*899+100); //Auto ID
        this.campus = new Campus(idcampus, nombre, direccion, fechaini.toISOString(), fechafin.toISOString());
        this.http.post<JSON>('http://localhost:3000/api/campus/new', this.campus).subscribe(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });
        this.getCampusList();
    }

    updateCampus(idcampus:string, nombre:string, direccion:string, fechaini:Date, fechafin:Date) {
        this.campus = new Campus(idcampus, nombre, direccion, fechaini.toISOString(), fechafin.toISOString());
        this.http.put<JSON>('http://localhost:3000/api/campus/update/'+idcampus, this.campus).subscribe(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });
        this.getCampusList();
    }

    deleteCampus(idcampus:string) {
        this.http.delete<JSON>('http://localhost:3000/api/campus/delete/'+idcampus).subscribe(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });
        this.getCampusList();
    }

}