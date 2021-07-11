import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { JornadaService } from 'src/app/jornada.service';
import { Jornada } from 'src/app/jornada.model';
import { MonthYear } from 'src/app/monthyear.model';
import { NgForm } from '@angular/forms';
import { ActividadService } from 'src/app/actividad.service';
import { Actividad } from 'src/app/actividad.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit, AfterViewInit {

  public dni: string = '';
  fecha: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000)); //Compensando la zona horaria

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute,
    public monitorService: MonitorService, public jornadaService: JornadaService, private changes: ChangeDetectorRef, public actividadService: ActividadService) { }

  ngOnInit(): void {
    this.userService.checkLogin(); //Checking if the user is logged in
    this.route.params.subscribe((params) => { //Monitor DNI gets extracted from the url
      this.dni = localStorage.getItem('user') || '';
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //In case the page is refreshed, the campus ID is also captured and used to check the service
        this.campusService.getCampus(id);
        this.campusService.getCampusList();
        this.campusService.getCampusListener().subscribe(() => {
          this.monitorService.getMonitorList();
          this.monitorService.getMonitor(this.dni);
        });
      }
    });

  }

  ngAfterViewInit() {
    this.monitorService.getMonitorListener().subscribe(newMonitor => {
      this.actividadService.getActividadListMonitor(newMonitor.dni, this.fecha);
      this.actividadService.getMonitorActividadListListener().subscribe(lista => {
        console.log(lista);
      });
    });
  }

  onNewContra(f:NgForm) {
    this.monitorService.updateContra(f.value.password);
  }

  onComienzaDia() {
    let comienzo: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000));
    this.monitorService.horaEnt(comienzo);
  }

  onTerminaDia() {
    let fin: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000));
    this.monitorService.horaSal(fin);
  }

}