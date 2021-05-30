import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'dialog-service';
import { ActividadService } from 'src/app/actividad.service';
import { CampusService } from 'src/app/campus.service';
import { MonitorService } from 'src/app/monitor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-editar-actividad',
  templateUrl: './editar-actividad.component.html',
  styleUrls: ['./editar-actividad.component.css']
})

//Si actualizamos dentro de este formulario, la fecha se resetea al día de hoy
//Comprobar la fecha que se carga al pulsar sobre la actividad

export class EditarActividadComponent implements OnInit, AfterViewInit {

  actividadForm = new FormGroup({ //Necesario para la actualización dinámica del formulario
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

  actividadUpdated: boolean = false;
  nombreActividad: string = '';
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

  constructor(private userService: UserService, public campusService: CampusService, public actividadService: ActividadService, public monitorService: MonitorService, private route: ActivatedRoute, private dialog: DialogService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.actividadService.error = '';
    this.route.params.subscribe((params) => { //Comprobamos idcampus e idactividad
      let id = params['idcampus'];
      let idactividad = params['idactividad'];
      if (this.campusService.campus.idcampus != id) { //Si el idcampus es otro (hemos cargado desde historial o recargado), volvemos al que dice la URL
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().subscribe(() => {
          this.monitorService.getMonitorList(); //Cuando tenemos el campus correcto, cargamos la lista de monitores
          this.monitorService.getMonitorListListener().subscribe(() => {
            this.actividadService.getActividad(idactividad); //Cuando tenemos toda la información, cargamos la actividad para que aparezca en el formulario
          });
        });
      } else {
        this.actividadService.getActividad(idactividad); //Si el campus era el correcto, cargamos la actividad
      }
    });
  }

  ngAfterViewInit(): void {
    this.actividadService.getActividadListener().subscribe(actividad => { //Cuando hemos pintado el formulario, lo rellenamos automáticamente
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

  onActividadUpdate() {
    this.actividadUpdated = false; //Para que muestre correctamente la barra de éxito si hemos mostrado previamente la de error
    this.actividadService.updateActividad(this.actividadForm.value.nombre, this.actividadForm.value.descripcion, this.actividadForm.value.horaini, this.actividadForm.value.minini, this.actividadForm.value.horafin, this.actividadForm.value.minfin, this.actividadForm.value.color, this.actividadForm.value.idgrupo, this.actividadForm.value.dnimonitor);
    this.actividadService.getErrorListener().subscribe(error => {
      if(error=='') {
        this.nombreActividad = this.actividadForm.value.nombre;
        this.actividadUpdated = true;
      }
    });
  }

  askDelete() {
    this.dialog.withConfirm('Estás seguro de que quieres borrar '+this.actividadService.actividad.nombre+'?').subscribe(response => {
      if(response) {
        this.actividadService.deleteActividad(this.actividadService.actividad.idactividad);
        this.actividadService.getActividadListListener().subscribe(() => {
          this.router.navigate(['/main/campus/'+this.campusService.campus.idcampus+'/calendario']);
        });
      }
    });
  }

}
