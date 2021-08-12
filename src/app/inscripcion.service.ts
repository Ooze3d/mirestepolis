import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Alergia } from './alergia.model';
import { CampusService } from './campus.service';
import { Constants } from './constants';
import { Dia } from './dia.model';
import { Familiar } from './familiar.model';
import { Inscripcion } from './inscripcion.model';
import { Pago } from './pago.model';
import { Trastorno } from './trastorno.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//import { InscripcionesComponent } from './main/campus/inscripciones/inscripciones.component';

@Injectable({ providedIn: 'root' })
export class InscripcionService implements OnInit, OnDestroy {

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
    destroyed: Subject<void> = new Subject<void>();

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
        this.http.get<Inscripcion[]>(Constants.url+'inscripciones/all/' + this.campusService.campus.idcampus).pipe(takeUntil(this.destroyed)).subscribe(inscripcionData => {
            this.inscripcionList = inscripcionData;
            this.inscripcionList.forEach(peque => {
                this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/child/' + peque.matricula).pipe(takeUntil(this.destroyed)).subscribe(alergiasList => {
                    peque.alergias = alergiasList;
                });
                this.http.get<Trastorno[]>(Constants.url+'inscripciones/conditions/child/' + peque.matricula).pipe(takeUntil(this.destroyed)).subscribe(trastornosList => {
                    peque.trastornos = trastornosList;
                });
                this.http.get<Familiar[]>(Constants.url+'inscripciones/fam/child/' + peque.matricula).pipe(takeUntil(this.destroyed)).subscribe(famList => {
                    peque.famList = famList;
                });
                this.http.get<Pago[]>(Constants.url+'inscripciones/dayspaid/' + peque.matricula).pipe(takeUntil(this.destroyed)).subscribe(payList => {
                    peque.payList = payList;
                });
                this.http.get<Dia[]>(Constants.url+'inscripciones/days/' + peque.matricula).pipe(takeUntil(this.destroyed)).subscribe(dayList => {
                    peque.dayList = dayList;
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

    getInscripcion(matricula: string) {
        this.http.get<Inscripcion[]>(Constants.url+'inscripciones/' + matricula).pipe(takeUntil(this.destroyed)).subscribe(inscripcionData => {
            this.inscripcion = inscripcionData[0];
            this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/child/' + this.inscripcion.matricula).pipe(takeUntil(this.destroyed)).subscribe(alergiasList => {
                this.inscripcion.alergias = alergiasList;
            });
            this.http.get<Alergia[]>(Constants.url+'inscripciones/conditions/child/' + this.inscripcion.matricula).pipe(takeUntil(this.destroyed)).subscribe(trastornosList => {
                this.inscripcion.trastornos = trastornosList;
            });
            this.http.get<Familiar[]>(Constants.url+'inscripciones/fam/child/' + this.inscripcion.matricula).pipe(takeUntil(this.destroyed)).subscribe(famList => {
                this.inscripcion.famList = famList;
            });
            this.http.get<Pago[]>(Constants.url+'inscripciones/dayspaid/' + this.inscripcion.matricula).pipe(takeUntil(this.destroyed)).subscribe(payList => {
                this.inscripcion.payList = payList;
            });
            this.http.get<Dia[]>(Constants.url+'inscripciones/days/' + this.inscripcion.matricula).pipe(takeUntil(this.destroyed)).subscribe(dayList => {
                this.inscripcion.dayList = dayList;
            });
            this.inscripcionListener.next(this.inscripcion);
        });
    }

    getFamList() { //Full list of already registered family members
        this.http.get<Familiar[]>(Constants.url+'inscripciones/fam').pipe(takeUntil(this.destroyed)).subscribe((famData) => {
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
        this.http.get<Alergia[]>(Constants.url+'inscripciones/allergies/all').pipe(takeUntil(this.destroyed)).subscribe((alergiaData) => {
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
        this.http.post<{ message: string }>(Constants.url+'inscripciones/allergies/new', [nombre, descripcion, this.inscripcion.matricula]).pipe(takeUntil(this.destroyed)).subscribe((response) => {
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
        this.http.get<Trastorno[]>(Constants.url+'inscripciones/conditions/all').pipe(takeUntil(this.destroyed)).subscribe((trastornoData) => {
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
        this.http.post<{ message: string }>(Constants.url+'inscripciones/conditions/new', [nombre, descripcion, this.inscripcion.matricula]).pipe(takeUntil(this.destroyed)).subscribe((response) => {
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
        this.http.post<{ message: string }>(Constants.url+'inscripciones/new/' + this.campusService.campus.idcampus, this.inscripcion).pipe(takeUntil(this.destroyed)).subscribe(response => {
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
        this.http.delete<{ message: string }>(Constants.url+'inscripciones/delete/' + matricula).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
        }, error => {
            this.error = 'Borrado...';
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    checkInscripcion(matricula: string): boolean {
        this.http.get<{message: boolean}>(Constants.url+'inscripciones/check' + matricula).pipe(takeUntil(this.destroyed)).subscribe(response => {
            return response.message;
        });
        return false;
    }

    addFamiliar() {
        this.http.post<{ message: string }>(Constants.url+'inscripciones/fam/new/' + this.inscripcion.matricula, this.familiar).pipe(takeUntil(this.destroyed)).subscribe(response => {
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

    addDia(d: Dia) { //For updates (creates full attended day)
        this.http.post<{ message: string }>(Constants.url+'inscripciones/days/newday/', d).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito += '';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
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

    newEntrada(fecha: Date, matricula: string) { 
        this.http.post<{ message: string }>(Constants.url+'inscripciones/days/checkin', { fecha: fecha.toISOString(), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
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

    deleteEntrada(fecha: Date, matricula: string) {
        this.http.delete<{ message: string }>(Constants.url+'inscripciones/days/checkin/'+fecha.toISOString().split('/').join('-').substr(0,10)+'/'+matricula).pipe(takeUntil(this.destroyed)).subscribe(response => {
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

    newAulaMat(fecha: Date, matricula: string) { 
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/daycare', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando el aula matinal';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    deleteAulaMat(fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/deletedaycare', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error borrando el aula matinal';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newComedor(fecha: Date, matricula: string) { 
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/meal', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando el comedor';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    deleteComedor(fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/deletemeal', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error borrando el comedor';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newPostCom(fecha: Date, matricula: string) { 
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/postmeal', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando el post-comedor';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    deletePostCom(fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/deletepostmeal', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error borrando el post-comedor';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newSalida(dnifam: string, fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/checkout', { dnifamiliar: dnifam, fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
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

    deleteSalida(fecha: Date, matricula: string) {
        this.http.put<{ message: string }>(Constants.url+'inscripciones/days/deletecheckout/', { fecha: fecha.toISOString().split('/').join('-').substr(0,10), matricula: matricula }).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error borrando la salida';
            this.getInscripcionList();
            this.getInscripcionListListener().next(this.inscripcionList);
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    newPaid(p: Pago) {
        this.http.post<{ message: string }>(Constants.url+'inscripciones/days/newpaid', {fecha: p.fecha, matricula: p.matricula, aulamat: p.aulamat, comedor: p.comedor, postcom: p.postcom}).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcion(p.matricula);
            this.getInscripcionListener().next(this.inscripcion);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error registrando el día';
            this.getInscripcion(p.matricula);
            this.getInscripcionListener().next(this.inscripcion);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        });
    }

    deletePaid(matricula: string, fecha: string) {
        this.http.delete<{ message: string }>(Constants.url+'inscripciones/dayspaid/'+matricula+'/'+fecha).pipe(takeUntil(this.destroyed)).subscribe(response => {
            this.exito = response.message;
            this.getInscripcion(matricula);
            this.getInscripcionListener().next(this.inscripcion);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, error => {
            this.error = 'Error borrando el día';
            this.getInscripcion(matricula);
            this.getInscripcionListener().next(this.inscripcion);
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        });
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
      }

}