import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Alergia } from './alergia.model';
import { CampusService } from './campus.service';
import { Familiar } from './familiar.model';
import { Inscripcion } from './inscripcion.model';
import { Trastorno } from './trastorno.model';

@Injectable({ providedIn: 'root' })
export class InscripcionService implements OnInit {

    exito: string = '';
    error: string = '';
    inscripcion: Inscripcion = new Inscripcion('Nombre', 'Apellidos', new Date().toISOString(), 0, 0, 'idgrupo');
    familiar: Familiar = new Familiar('00000000A', 'Nombre', 'Apellidos', 999111222, 'nombre@mail.com', 'tipofam', 0);
    allFamList: Familiar[] = [];
    allAlergiasList: Alergia[] = [];
    allTrastornosList: Trastorno[] = [];
    inscripcionList: Inscripcion[] = [];
    private famListener = new Subject<Familiar>();
    private famListListener = new Subject<Familiar[]>();
    private inscripcionListener = new Subject<Inscripcion>();
    private inscripcionListListener = new Subject<Inscripcion[]>();
    private alergiasListListener = new Subject<Alergia[]>();
    private trastornosListListener = new Subject<Trastorno[]>();

    constructor(private http: HttpClient, private campusService: CampusService) { }

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

    getAlergiasListListener() {
        return this.alergiasListListener;
    }

    getTrastornosListListener() {
        return this.trastornosListListener;
    }

    getInscripcionList() {
        this.http.get<Inscripcion[]>('http://localhost:3000/api/inscripciones/' + this.campusService.campus.idcampus).subscribe(inscripcionData => {
            this.inscripcionList = inscripcionData;
            this.inscripcionList.forEach(peque => {
                this.http.get<Alergia[]>('http://localhost:3000/api/inscripciones/allergies/child/'+peque.matricula).subscribe(alergiasList => {
                    peque.alergias = alergiasList;
                });
                this.http.get<Alergia[]>('http://localhost:3000/api/inscripciones/conditions/child/'+peque.matricula).subscribe(trastornosList => {
                    peque.trastornos = trastornosList;
                });
                this.http.get<Familiar[]>('http://localhost:3000/api/inscripciones/fam/child/'+peque.matricula).subscribe(famList => {
                    peque.famList = famList;
                });
            });
            this.inscripcionListListener.next(this.inscripcionList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getFamList() {
        this.http.get<Familiar[]>('http://localhost:3000/api/inscripciones/fam').subscribe((famData) => {
            this.allFamList = famData;
            this.famListListener.next(this.allFamList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getAlergiasList() {
        this.http.get<Alergia[]>('http://localhost:3000/api/inscripciones/allergies/all').subscribe((alergiaData) => {
            this.allAlergiasList = alergiaData;
            this.alergiasListListener.next(this.allAlergiasList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newAlergia(nombre:string, descripcion:string) {
        this.http.post<{ message:string }>('http://localhost:3000/api/inscripciones/allergies/new', [nombre, descripcion, this.inscripcion.matricula]).subscribe((response) => {
            this.getAlergiasList();
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getTrastornosList() {
        this.http.get<Trastorno[]>('http://localhost:3000/api/inscripciones/conditions/all').subscribe((trastornoData) => {
            this.allTrastornosList = trastornoData;
            this.trastornosListListener.next(this.allTrastornosList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newTrastorno(nombre:string, descripcion:string) {
        this.http.post<{ message:string }>('http://localhost:3000/api/inscripciones/conditions/new', [nombre, descripcion, this.inscripcion.matricula]).subscribe((response) => {
            this.getAlergiasList();
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    addInscripcion() {
        this.http.post<{ message: string }>('http://localhost:3000/api/inscripciones/new/' + this.campusService.campus.idcampus, this.inscripcion).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
            this.getInscripcionList();
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    addFamiliar() {
        this.http.post<{ message: string }>('http://localhost:3000/api/inscripciones/fam/new/' + this.inscripcion.matricula, this.familiar).subscribe(response => {
            this.exito += ' - '+response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
            this.getFamList();
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

}