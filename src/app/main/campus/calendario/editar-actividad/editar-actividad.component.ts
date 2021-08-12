import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'dialog-service';
import { Actividad } from 'src/app/actividad.model';
import { ActividadService } from 'src/app/actividad.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editar-actividad',
  templateUrl: './editar-actividad.component.html',
  styleUrls: ['./editar-actividad.component.css']
})

//If the page gets refreshed while on this form, the date on the service gets replaced for today

export class EditarActividadComponent implements OnInit, AfterViewInit, OnDestroy {

  actividadForm = new FormGroup({ //FormGroup allows the form to be dynamically filled
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    horaini: new FormControl(''),
    minini: new FormControl(''),
    horafin: new FormControl(''),
    minfin: new FormControl(''),
    color: new FormControl(''),
    idgrupo: new FormControl(''),
    dnimonitor: new FormControl('')
  });

  idactividad: number = 0;
  filteredActividadList: Actividad[] = [];
  horas: string[] = ['08', '09', '10', '11', '12', '13', '14'];
  minutos: string[] = ['00', '15', '30', '45'];
  colores: { nombre: string, hex: string }[] = [
    { nombre: "Light Pink", hex: "#FFADAD" },
    { nombre: "Deep Champagne", hex: "#FFD6A5" },
    { nombre: "Lemon Yellow Crayola", hex: "#FDFFB6" },
    { nombre: "Tea Green", hex: "#CAFFBF" },
    { nombre: "Celeste", hex: "#9BF6FF" },
    { nombre: "Baby Blue Eyes", hex: "#A0C4FF" },
    { nombre: "Maximum Blue Purple", hex: "#BDB2FF" },
    { nombre: "Mauve", hex: "#FFC6FF" }
  ];

  destroyed: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, public campusService: CampusService, public actividadService: ActividadService, public monitorService: MonitorService, private route: ActivatedRoute, private dialog: DialogService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.actividadService.error = '';
    if(localStorage.getItem('fechaAct')!='')
            this.actividadService.fecha = new Date(localStorage.getItem('fechaAct')!);
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => { //Check for idcampus and idactividad
      let id = params['idcampus'];
      this.idactividad = params['idactividad'];
      if (this.campusService.campus.idcampus != id) { //Checking if the campus on the service and the id on the url match
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.monitorService.getMonitorList(); //When the correct campus is loaded, the rest of the info is updated
          this.monitorService.getMonitorListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.actividadService.getActividad(this.idactividad); //With all needed info ready, the activity is loaded
          });
        });
      } else {
        this.actividadService.getActividad(this.idactividad); //If the campus was correct, we simply load the activity
      }
    });
  }

  ngAfterViewInit(): void {
    this.actividadService.getAllActividadList(); //A full list of all activities ever created is needed
    this.actividadService.getAllActividadListListener().pipe(takeUntil(this.destroyed)).subscribe();
    this.actividadService.getActividadListener().pipe(takeUntil(this.destroyed)).subscribe(actividad => { //Once the form is ready, we can fill the fields with the activity
      this.actividadForm.setValue({
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        horaini: actividad.fechaini.substr(11,2),
        minini: actividad.fechaini.substr(14,2),
        horafin: actividad.fechafin.substr(11,2),
        minfin: actividad.fechafin.substr(14,2),
        color: actividad.color,
        idgrupo: actividad.idgrupo,
        dnimonitor: actividad.dnimonitor
      });
    });
  }

  filterActividades() { //Narrows down the list comparing it to the name that's being written
    this.filteredActividadList = this.actividadService.allActividadList.filter(x => x.nombre.toLowerCase().includes(this.actividadForm.value.nombre.toLowerCase()));
    console.log(this.actividadForm.value.nombre);
    console.log(this.filteredActividadList);
  }

  onActividadUpdate() {
    this.actividadService.updateActividad(this.idactividad, this.actividadForm.value.nombre, this.actividadForm.value.descripcion, this.actividadForm.value.horaini, this.actividadForm.value.minini, this.actividadForm.value.horafin, this.actividadForm.value.minfin, this.actividadForm.value.color, this.actividadForm.value.idgrupo, this.actividadForm.value.dnimonitor);
  }

  askDelete() {
    this.dialog.withConfirm('Estás seguro de que quieres borrar '+this.actividadService.actividad.nombre+'?', {content: '¡Esta acción no puede deshacerse!', acceptButton: 'Sí', cancelButton: 'No'}).pipe(takeUntil(this.destroyed)).subscribe(response => {
      if(response) {
        this.actividadService.deleteActividad(this.actividadService.actividad.idactividad);
        this.actividadService.getActividadListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.router.navigate(['/main/campus/'+this.campusService.campus.idcampus+'/calendario']);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
