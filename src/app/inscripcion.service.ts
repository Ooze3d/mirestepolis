import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Alergia } from './alergia.model';
import { CampusService } from './campus.service';
import { Constants } from './constants';
import { Familiar } from './familiar.model';
import { Inscripcion } from './inscripcion.model';
import { Pago } from './pago.model';
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
    mesesList: { numero: number, texto: string }[] = [];

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

    getInscripcionList() { //Get full child object, including family members, allergies and conditions
        this.http.get<Inscripcion[]>(Constants.url+'inscripciones/all/' + this.campusService.campus.idcampus).subscribe(inscripcionData => {
            this.inscripcionList = inscripcionData;
            this.inscripcionList.forEach(peque => {
                this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/child/' + peque.matricula).subscribe(alergiasList => {
                    peque.alergias = alergiasList;
                });
                this.http.get<Trastorno[]>(Constants.url+'inscripciones/conditions/child/' + peque.matricula).subscribe(trastornosList => {
                    peque.trastornos = trastornosList;
                });
                this.http.get<Familiar[]>(Constants.url+'inscripciones/fam/child/' + peque.matricula).subscribe(famList => {
                    peque.famList = famList;
                });
                this.http.get<Pago[]>(Constants.url+'inscripciones/days/' + peque.matricula).subscribe(dayList => {
                    peque.dayList = dayList;
                });
            });
            this.inscripcionListListener.next(this.inscripcionList);
            console.log(this.inscripcionList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getInscripcion(matricula: string) {
        this.http.get<Inscripcion[]>(Constants.url+'inscripciones/' + matricula).subscribe(inscripcionData => {
            this.inscripcion = inscripcionData[0];
            this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/child/' + this.inscripcion.matricula).subscribe(alergiasList => {
                this.inscripcion.alergias = alergiasList;
            });
            this.http.get<Alergia[]>(Constants.url+'inscripciones/conditions/child/' + this.inscripcion.matricula).subscribe(trastornosList => {
                this.inscripcion.trastornos = trastornosList;
            });
            this.http.get<Familiar[]>(Constants.url+'inscripciones/fam/child/' + this.inscripcion.matricula).subscribe(famList => {
                this.inscripcion.famList = famList;
            });
            this.http.get<Pago[]>(Constants.url+'inscripciones/days/' + this.inscripcion.matricula).subscribe(dayList => {
                this.inscripcion.dayList = dayList;
            });
            this.http.get<{ numero: number, texto: string }[]>(Constants.url+'inscripciones/months/' + this.inscripcion.matricula).subscribe(monthList => {
                this.mesesList = monthList;
                this.convertNombres(this.mesesList);
                console.log(this.mesesList);
            });
            this.inscripcionListener.next(this.inscripcion);
        });
    }

    getFamList() { //Full list of already registered family members
        this.http.get<Familiar[]>(Constants.url+'inscripciones/fam').subscribe((famData) => {
            this.allFamList = famData;
            this.famListListener.next(this.allFamList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    getAlergiasList() { //Full list of allergies
        this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/all').subscribe((alergiaData) => {
            this.allAlergiasList = alergiaData;
            this.alergiasListListener.next(this.allAlergiasList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newAlergia(nombre: string, descripcion: string) {
        this.http.post<{ message: string }>(Constants.url+'inscripciones/allergies/new', [nombre, descripcion, this.inscripcion.matricula]).subscribe((response) => {
            this.getAlergiasList();
        }, error => {
            if (error.error.error.code != 'ER_DUP_ENTRY') {
                this.error = error.error.error;
                setTimeout(() => {
                    this.error = '';
                }, 3000);
            }
        });
    }

    getTrastornosList() { //Full list of conditions
        this.http.get<Trastorno[]>(Constants.url+'inscripciones/conditions/all').subscribe((trastornoData) => {
            this.allTrastornosList = trastornoData;
            this.trastornosListListener.next(this.allTrastornosList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newTrastorno(nombre: string, descripcion: string) {
        this.http.post<{ message: string }>(Constants.url+'inscripciones/conditions/new', [nombre, descripcion, this.inscripcion.matricula]).subscribe((response) => {
            this.getTrastornosList();
        }, error => {
            if (error.error.error.code != 'ER_DUP_ENTRY') {
                this.error = error.error.error;
                setTimeout(() => {
                    this.error = '';
                }, 3000);
            }
        });
    }

    addInscripcion() { //Inscriptions with duplicate family members, allergies or conditions will ALWAYS give XHR errors, but they can be dismissed
        this.http.post<{ message: string }>(Constants.url+'inscripciones/new/' + this.campusService.campus.idcampus, this.inscripcion).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
        }, error => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    deleteInscripcion(matricula: string) {
        this.http.delete<{ message: string }>(Constants.url+'inscripciones/delete/' + matricula).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Borrado...';
            console.log(error);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
        this.getInscripcionList();
        this.getInscripcionListListener().next(this.inscripcionList);
    }

    addFamiliar() {
        this.http.post<{ message: string }>(Constants.url+'inscripciones/fam/new/' + this.inscripcion.matricula, this.familiar).subscribe(response => {
            this.exito += ' - ' + response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
            this.getFamList();
        }, error => {
            if (error.error.error.code != 'ER_DUP_ENTRY') {
                this.error = error.error.error;
                setTimeout(() => {
                    this.error = '';
                }, 3000);
            }
        });
    }

    addDias() { //Add registered days to database
        this.inscripcion.dayList.forEach(x => {
            this.http.post<{ message: string }>(Constants.url+'inscripciones/days/new', x).subscribe(() => {
            });
        });
    }

    convertNombres(list: { numero: number, texto: string }[]) { //Convert month names
        let lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        list.forEach(x => {
            x.texto = lista[x.numero - 1];
        });
    }

    newEntrada(fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/checkin', { fecha: fecha.toISOString(), matricula: matricula }).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando la entrada';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newSalida(dnifam: string, fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/checkout', { dnifamiliar: dnifam, fecha: fecha.toISOString(), matricula: matricula }).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando la entrada';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

}