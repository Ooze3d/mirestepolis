import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from 'src/app/campus.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MonitorService } from 'src/app/monitor.service';
import { JornadaService } from 'src/app/jornada.service';
import { Jornada } from 'src/app/jornada.model';
import { MonthYear } from 'src/app/monthyear.model';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, AfterViewInit {

  public dni: string = '';
  public monitorUpdated = false;
  public indexEdit:number = -1;
  public jornadasList: Jornada[] = [];

  monitorForm = new FormGroup({ //Necesario para la actualización dinámica del formulario
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl(''),
    especialidad: new FormControl(''),
    idcampus: new FormControl(''),
    idgrupo: new FormControl('')
  });

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute, 
    public monitorService: MonitorService, public jornadaService:JornadaService, private changes:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.checkLogin(); //Comprobamos que estamos logueados
    this.route.params.subscribe((params) => { //Extraemos el DNI de la url
      this.dni = params['dni'];
    });

    this.campusService.getGruposList();

    this.monitorService.getMonitor(this.dni); //Cargamos el monitor en el servicio a través del DNI

    this.monitorService.getMonitorListener().subscribe(newMonitor => { //Actualizar los valores del formulario de edición del monitor
      this.monitorForm.setValue({
        nombre: newMonitor.nombre,
        apellidos: newMonitor.apellidos,
        telefono: newMonitor.telefono,
        email: newMonitor.email,
        especialidad: newMonitor.especialidad,
        idcampus: newMonitor.idcampus,
        idgrupo: newMonitor.idgrupo
      });

      if(this.jornadaService.monthyear!='')
            this.jornadaService.getJornadasMes(this.jornadaService.mes.year, this.jornadaService.mes.month);
      else
            this.jornadaService.getJornadasList();
            
      this.jornadaService.getMesesList();
    });

  }

  ngAfterViewInit() {
    
  }

  onMesChange() {
    this.jornadaService.mes = new MonthYear(this.jornadaService.monthyear);
    this.jornadaService.getJornadasMes(this.jornadaService.mes.year, this.jornadaService.mes.month);
  }

  onClickEdit(i:number) {
    this.jornadaService.jornada = this.jornadaService.jornadasList[i]; //Metemos la posición "i" de la lista de jornadas en el objeto jornada de jornadaService
    this.indexEdit = this.indexEdit!=i? i : -1; //Intercambia editable/no editable
  }

  onJornadaUpdate() {
    this.jornadaService.updateJornada();
    this.indexEdit = -1; //Quitamos el modo de edición
    //this.changes.detectChanges();
  }

  onJornadaDelete() {
    this.jornadaService.deleteJornada();
    this.indexEdit = -1;
    //this.changes.detectChanges();
  }

  onNewJornada(f:NgForm) {
    if (f.invalid)
      return;
    else {
      this.jornadaService.addJornada(new Date(f.value.fecha).toISOString(), f.value.horaent, f.value.horasal, this.monitorService.monitor.dni);
      //this.changes.detectChanges();
    }
  }

  onMonitorUpdate() {
    this.monitorService.updateMonitor(this.dni, this.monitorForm.value.nombre, this.monitorForm.value.apellidos, this.monitorForm.value.telefono, this.monitorForm.value.email, this.monitorForm.value.especialidad, this.monitorForm.value.idcampus, this.monitorForm.value.idgrupo);
    this.monitorUpdated = true;
    this.changes.detectChanges();
  }

}