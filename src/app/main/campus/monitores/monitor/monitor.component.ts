import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  public indexEdit: number = -1;
  public jornadasList: Jornada[] = [];

  monitorForm = new FormGroup({ //FormGroup allows the form to be dynamically filled
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    telefono: new FormControl(''),
    email: new FormControl(''),
    especialidad: new FormControl(''),
    idcampus: new FormControl(''),
    idgrupo: new FormControl('')
  });

  constructor(public campusService: CampusService, private userService: UserService, private route: ActivatedRoute,
    public monitorService: MonitorService, public jornadaService: JornadaService, private changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.checkLogin(); //Checking if the user is logged in
    this.route.params.subscribe((params) => { //Monitor DNI gets extracted from the url
      this.dni = params['dni'];
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //In case the page is refreshed, the campus ID is also captured and used to check the service
        this.campusService.getCampus(id);
        this.campusService.getCampusList();
        this.campusService.getCampusListener().subscribe(campus => {
          this.monitorService.getMonitorList();
        });
      }
    });

    this.campusService.getGruposList();

    this.monitorService.getMonitor(this.dni); //The monitor gets loaded into the service using the DNI

    this.monitorService.getMonitorListener().subscribe(newMonitor => { //The form gets dynamically filled
      this.monitorForm.setValue({
        nombre: newMonitor.nombre,
        apellidos: newMonitor.apellidos,
        telefono: newMonitor.telefono,
        email: newMonitor.email,
        especialidad: newMonitor.especialidad,
        idcampus: newMonitor.idcampus,
        idgrupo: newMonitor.idgrupo
      });

      if (this.jornadaService.monthyear != '')
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
    this.jornadaService.getJornadasListListener().subscribe();
  }

  onClickEdit(i: number) {
    this.jornadaService.jornada = this.jornadaService.jornadasList[i]; //If the user clicks "edit" on a certain day, it gets automatically sent to the service to edit
    this.indexEdit = this.indexEdit != i ? i : -1; //Switch edit mode
  }

  onJornadaUpdate() {
    this.jornadaService.updateJornada();
    this.indexEdit = -1; //Turn off edit mode
    this.jornadaService.getJornadasListListener().subscribe();
  }

  onJornadaDelete() {
    this.jornadaService.deleteJornada();
    this.indexEdit = -1;
    this.jornadaService.getJornadasListListener().subscribe();
  }

  onNewJornada(f: NgForm) {
    if (f.invalid)
      return;
    else {
      this.jornadaService.addJornada(new Date(f.value.fecha).toISOString(), f.value.horaent, f.value.horasal, this.monitorService.monitor.dni);
      this.jornadaService.getJornadasListListener().subscribe();
    }
  }

  onMonitorUpdate() {
    this.monitorService.updateMonitor(this.dni, this.monitorForm.value.nombre, this.monitorForm.value.apellidos, this.monitorForm.value.telefono, this.monitorForm.value.email, this.monitorForm.value.especialidad, this.monitorForm.value.idcampus, this.monitorForm.value.idgrupo);
    //this.changes.detectChanges();
  }

}
