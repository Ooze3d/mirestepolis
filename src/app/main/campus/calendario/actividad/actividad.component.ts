import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actividad } from 'src/app/actividad.model';
import { ActividadService } from 'src/app/actividad.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})

export class ActividadComponent implements OnInit, OnDestroy {

  nombre:FormControl = new FormControl();
  filteredActividadList: Actividad[] = [];
  horas:string[] = ['08', '09', '10', '11', '12', '13', '14'];
  minutos:string[] = ['00', '15', '30', '45'];
  colores:{nombre:string, hex:string}[] = [
    {nombre: "Light Pink", hex: "#FFADAD"},
    {nombre: "Deep Champagne", hex: "#FFD6A5"},
    {nombre: "Lemon Yellow Crayola", hex: "#FDFFB6"},
    {nombre: "Tea Green", hex: "#CAFFBF"},
    {nombre: "Celeste", hex: "#9BF6FF"},
    {nombre: "Baby Blue Eyes", hex: "#A0C4FF"},
    {nombre: "Maximum Blue Purple", hex: "#BDB2FF"},
    {nombre: "Mauve", hex: "#FFC6FF"}
  ];

  destroyed: Subject<void> = new Subject<void>();

  constructor(private userService:UserService, public campusService:CampusService, public actividadService:ActividadService, public monitorService:MonitorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    if(localStorage.getItem('fechaAct')!='')
            this.actividadService.fecha = new Date(localStorage.getItem('fechaAct')!);
    this.actividadService.error = '';
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => { //Page refresh failsafe checks if the page is showing the info that the url is pointing to
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) {
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.monitorService.getMonitorList();
          this.actividadService.getAllActividadList(); //A full list of all activities ever created is needed
          this.actividadService.getAllActividadListListener().pipe(takeUntil(this.destroyed)).subscribe();
        });
      }
    });
  }

  filterActividades() { //Narrows down the list comparing it to the name that's being written
    this.filteredActividadList = this.actividadService.allActividadList.filter(x => x.nombre.toLowerCase().includes(this.nombre.value.toLowerCase()));
  }

  onNewActividad(f:NgForm) { //Simple call to service to register a new actiivity
    this.actividadService.addActividad(this.nombre.value, f.value.descripcion, f.value.horaini, f.value.minini, f.value.horafin, f.value.minfin, f.value.color, f.value.idgrupo, f.value.dnimonitor);
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
