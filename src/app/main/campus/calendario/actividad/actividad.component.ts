import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActividadService } from 'src/app/actividad.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  nombre:FormControl = new FormControl();
  actividadAdded:boolean = false;
  nombreActividad:string = '';
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

  constructor(private userService:UserService, public campusService:CampusService, public actividadService:ActividadService, public monitorService:MonitorService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.actividadService.error = '';
  }

  onNewActividad(f:NgForm) {
    this.actividadService.addActividad(this.nombre.value, f.value.descripcion, f.value.horaini, f.value.minini, f.value.horafin, f.value.minfin, f.value.color, f.value.idgrupo, f.value.dnimonitor);
    this.actividadService.getErrorListener().subscribe(error => {
      if(error=='') {
        this.nombreActividad = this.nombre.value;
        this.actividadAdded = true;
      }
    });
  }

}
