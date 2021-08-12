import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'dialog-service';
import { CampusService } from 'src/app/campus.service';
import { Inscripcion } from 'src/app/inscripcion.model';
import { InscripcionService } from 'src/app/inscripcion.service';
import { UserService } from 'src/app/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit, AfterViewInit, OnDestroy {

  busca: string = '';
  listaFiltered: Inscripcion[] = [];
  editar: boolean = false;
  fecha: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000)); //Compensando la zona horaria
  destroyed: Subject<void> = new Subject<void>();

  constructor(public campusService: CampusService, public inscripcionService: InscripcionService, public userService: UserService, private route: ActivatedRoute, private dialog: DialogService, private changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.campusService.getGruposList();
          this.inscripcionService.getInscripcionList();
        });
      } else {
        this.inscripcionService.getInscripcionList();
      }
    });
  }

  ngAfterViewInit(): void {
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  buscaPeque() {
    this.listaFiltered = [];
    this.listaFiltered = this.inscripcionService.inscripcionList.filter(
      x => {
        return x.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.busca.toLowerCase()) || //Avoid accents in the search
          x.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.busca.toLowerCase())
      });
    this.inscripcionService.inscripcionList.forEach(x => { //Exclusive for family members DNI
      let found = false;
      x.famList.forEach(fam => {
        if (fam.dni.toLowerCase().includes(this.busca.toLowerCase())) { //Find DNI match
          found = true;
          return;
        }
      });
      if (found && !this.listaFiltered.includes(x)) //If not already in the list, add it
        this.listaFiltered.push(x);
    });
    this.listaFiltered.sort(this.compara);
  }

  compara(a: Inscripcion, b: Inscripcion) {
    return a.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') <= b.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ? -1 : 1;
  }

  checkPaidDay(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].payList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay())
        resp = true;
    });
    return resp;
  }

  checkPaidAulaMat(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].payList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.aulamat==1)
        resp = true;
    });
    return resp;
  }

  checkPaidComedor(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].payList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.comedor==1)
        resp = true;
    });
    return resp;
  }

  checkPaidPostCom(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].payList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.postcom==1)
        resp = true;
    });
    return resp;
  }

  checkEntrada(i:number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.entrada==1)
        resp = true;
    });
    return resp;
  }

  checkAulaMat(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.aulamat==1)
        resp = true;
    });
    return resp;
  }

  checkComedor(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.comedor==1)
        resp = true;
    });
    return resp;
  }

  checkPostCom(i: number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.postcom==1)
        resp = true;
    });
    return resp;
  }

  checkSalida(i:number): boolean {
    let resp: boolean = false;
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.salida==1)
        resp = true;
    });
    return resp;
  }

  returnFam(i:number): string | undefined {
    let fam: string = '';
    this.listaFiltered[i].dayList.forEach(x => {
      let temp = new Date(x.fecha);
      if(temp.getFullYear()==this.fecha.getFullYear() && temp.getMonth()==this.fecha.getMonth() && temp.getDay()==this.fecha.getDay() && x.salida==1)
        fam = x.dnifamiliar;
    });

    if(fam!='') { //Even 'Other' returns a DNI, so if fam is empty, the search returned no values
      let nombre: string | undefined = this.listaFiltered[i].famList.find(x => x.dni==fam)?.nombre + ' ' + this.listaFiltered[i].famList.find(x => x.dni==fam)?.apellidos;
      if (nombre=='undefined undefined')
        return 'Otro familiar';
      else
        return nombre;
    }
    
    return undefined;
  }

  onEntrada(i:number) {
    this.inscripcionService.newEntrada(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onDeleteEntrada(i: number) {
    this.inscripcionService.deleteEntrada(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onSalida(i:number, f:NgForm) {
    if(f.value.dnifamiliar=='') {
      this.inscripcionService.error = 'Por favor, elige un familiar';
      setTimeout(() => {
        this.inscripcionService.error = '';
    }, 3000);
      return;
    } else {
      this.inscripcionService.newSalida(f.value.dnifamiliar, this.fecha, this.listaFiltered[i].matricula);
      this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
        this.listaFiltered = list.sort(this.compara);
      });
    }
  }

  onDeleteSalida(i:number) {
    this.inscripcionService.deleteSalida(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onAulaMat(i: number) {
    this.inscripcionService.newAulaMat(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onDeleteAulaMat(i: number) {
    this.inscripcionService.deleteAulaMat(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onComedor(i: number) {
    this.inscripcionService.newComedor(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onDeleteComedor(i: number) {
    this.inscripcionService.deleteComedor(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onPostCom(i: number) {
    this.inscripcionService.newPostCom(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  onDeletePostCom(i: number) {
    this.inscripcionService.deletePostCom(this.fecha, this.listaFiltered[i].matricula);
    this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
 
}
