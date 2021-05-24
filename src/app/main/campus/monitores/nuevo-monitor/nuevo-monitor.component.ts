import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-nuevo-monitor',
  templateUrl: './nuevo-monitor.component.html',
  styleUrls: ['./nuevo-monitor.component.css']
})
export class NuevoMonitorComponent implements OnInit {

  monitorAdded: boolean = false;
  monitorDuplicated: boolean = false;
  nombreMonitor: string = '';
  gruposList: { idgrupo: string, nombre: string }[] = [];

  constructor(private userService: UserService, private monitorService: MonitorService, public campusService: CampusService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.campusService.getGruposList();
  }

  onNewMonitor(f: NgForm) {
    if (f.invalid)
      return;
    else if (this.validaNif(f.value.dni)) {
      this.monitorService.addMonitor(f.value.dni, f.value.nombre, f.value.apellidos, f.value.telefono, f.value.email, f.value.especialidad, this.campusService.campus.idcampus, f.value.idgrupo);
      this.monitorService.getErrorListener().subscribe(error => {
        if(error=='DUPLICADO')
          this.monitorDuplicated = true;
        else {
          this.nombreMonitor = f.value.nombre;
          this.monitorDuplicated = false;
          this.monitorAdded = true;
        }
      });
    } else {
      f.controls['dni'].setErrors({'incorrect': true});
      return;
    }
  }

  validaNif(docu: string) {
    let codigo: string[] = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
    docu = docu.trim();
    if (docu.length != 9) {
      return false;
    } else {
      let letra:string = docu.slice(-1);
      let numeros:number = Number(docu.slice(0, 8));
      if (Number(numeros) == NaN)
        return false;
      else if (codigo[Number(numeros) % 23] == letra)
        return true;
    }
    return false;
  }

}