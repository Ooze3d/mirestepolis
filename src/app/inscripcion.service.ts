import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CampusService } from './campus.service';
import { Familiar } from './familiar.model';
import { Inscripcion } from './inscripcion.model';
 
@Injectable({providedIn: 'root'})
export class InscripcionService implements OnInit {

    exito:string = '';
    error:string = '';
    inscripcion: Inscripcion = new Inscripcion('Nombre', 'Apellidos', new Date().toISOString(), 0, 0, 0, 'idgrupo');
    familiar: Familiar = new Familiar('00000000A', 'Nombre', 'Apellidos', 999111222, 'nombre@mail.com', 'tipofam', 0);
    allFamList: Familiar[] = [];
    inscripcionList: Inscripcion[] = [];
    private famListener = new Subject<Familiar>();
    private famListListener = new Subject<Familiar[]>();
    private inscripcionListener = new Subject<Inscripcion>();
    private inscripcionListListener = new Subject<Inscripcion[]>();

    constructor(private http:HttpClient, private campusService:CampusService) {}

    ngOnInit(): void {

    }

    getFamListener() {
        return this.famListener;
    }

    getFamListListener() {
        return this.famListListener;
    }

    getInscripcionListener() {
        return this.inscripcionListener;
    }

    getInscripcionListListener() {
        return this.inscripcionListListener;
    }

    getInscripcionList() {
        this.http.get<Inscripcion[]>('http://localhost:3000/api/inscripciones/'+this.campusService.campus.idcampus).subscribe(inscripcionData => {
            this.inscripcionList = inscripcionData;
            this.inscripcionListListener.next(this.inscripcionList);
        }, error => {
            console.log(error);
        });
    }

    getFamList() {
        this.http.get<Familiar[]>('http://localhost:3000/api/inscripciones/fam').subscribe((famData) => {
            this.allFamList = famData;
            this.famListListener.next(this.allFamList);
        }, error => {
            console.log(error);
        });
    }

    addInscripcion() {
        this.http.post<{message:string}>('http://localhost:3000/api/inscripciones/new/'+this.campusService.campus.idcampus, this.inscripcion).subscribe(response => {
            this.getInscripcionList();
            this.exito = response.message;
        }, error => {
            console.log(error);
        });
    }

    addFamiliar() {
        this.http.post<{message:string}>('http://localhost:3000/api/inscripciones/fam/new/'+this.inscripcion.matricula, this.familiar).subscribe(response => {
            this.getFamList();
        }, error => {
            console.log(error);
        });
    }

}