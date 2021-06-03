import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-nuevo-monitor',
  templateUrl: './nuevo-monitor.component.html',
  styleUrls: ['./nuevo-monitor.component.css']
})
export class NuevoMonitorComponent implements OnInit, OnDestroy {

  routeParams:Subscription = new Subscription();
  monitorAdded: boolean = false;
  monitorDuplicated: boolean = false;
  nombreMonitor: string = '';
  gruposList: { idgrupo: string, nombre: string }[] = [];

  constructor(private userService: UserService, private monitorService: MonitorService, public campusService: CampusService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.routeParams = this.route.params.subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().subscribe(() => {
          this.campusService.getGruposList();
        });
      }
    });
  }

  onNewMonitor(f: NgForm) {
    if (f.invalid)
      return;
    else if (this.validaNif(f.value.dni)) {
      this.monitorService.addMonitor(f.value.dni, f.value.nombre, f.value.apellidos, f.value.telefono, f.value.email, f.value.especialidad, this.campusService.campus.idcampus, f.value.idgrupo);
      this.monitorService.getErrorListener().subscribe(error => {
        if(error=='DUPLICADO') //Checks for duplicated DNIs
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

  validaNif(docu: string) { //DNI letter validator
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

  ngOnDestroy(): void {
    this.routeParams.unsubscribe();
    //this.campusService.getCampusListener().unsubscribe();
    //this.monitorService.getErrorListener().unsubscribe();
  }

}