import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { JornadaService } from 'src/app/jornada.service';
import { NgForm } from '@angular/forms';
import { ActividadService } from 'src/app/actividad.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit, AfterViewInit, OnDestroy {

  public dni: string = '';
  fecha: Date = new Date(new Date().getTime() + (/*2 * */60 * 60 * 1000)); //Compensando la zona horaria
  checkEntrada: boolean = false;
  checkSalida: boolean = false;
  destroyed: Subject<void> = new Subject<void>();

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute,
    public monitorService: MonitorService, public jornadaService: JornadaService, private changes: ChangeDetectorRef, public actividadService: ActividadService) { }

  ngOnInit(): void {
    this.userService.checkLogin(); //Checking if the user is logged in
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => { //Monitor DNI gets extracted from the url
      this.dni = localStorage.getItem('user') || '';
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //In case the page is refreshed, the campus ID is also captured and used to check the service
        this.campusService.getCampus(id);
        this.campusService.getCampusList();
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.monitorService.getMonitorList();
          this.monitorService.getMonitorListListener().pipe(takeUntil(this.destroyed)).subscribe(lista => {
            this.monitorService.getMonitor(this.dni);
          });
        });
      }
    });

  }

  ngAfterViewInit() {
    this.monitorService.getMonitorListener().pipe(takeUntil(this.destroyed)).subscribe(newMonitor => {
      this.actividadService.getActividadListMonitor(newMonitor.dni, this.fecha);
      this.jornadaService.checkJornadaIn();
      this.jornadaService.checkJornadaOut();
    });
    this.actividadService.getMonitorActividadListListener().pipe(takeUntil(this.destroyed)).subscribe(lista => {
      //console.log(lista);
    });
    this.jornadaService.getJornadaInListener().pipe(takeUntil(this.destroyed)).subscribe(res => {
      this.checkEntrada = res;
    });
    this.jornadaService.getJornadaOutListener().pipe(takeUntil(this.destroyed)).subscribe(res => {
      this.checkSalida = res;
    });
    console.log("Entrada: " + this.checkEntrada);
    console.log("Salida: " + this.checkSalida);
  }

  onNewContra(f:NgForm) {
    this.monitorService.updateContra(f.value.password);
  }

  onComienzaDia() {
    let comienzo: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000));
    this.monitorService.horaEnt(comienzo);
    this.jornadaService.checkJornadaIn();
    this.jornadaService.getJornadaInListener().pipe(takeUntil(this.destroyed)).subscribe(res => {
      console.log(res);
      this.checkEntrada = res;
    });
  }

  onTerminaDia() {
    let fin: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000));
    this.monitorService.horaSal(fin);
    this.jornadaService.checkJornadaOut();
    this.jornadaService.getJornadaOutListener().pipe(takeUntil(this.destroyed)).subscribe(res => {
      this.checkSalida = res;
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}