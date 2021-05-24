import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from '../../campus.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MonitorService } from 'src/app/monitor.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit, AfterViewInit {

  public id: string = '';
  public campusUpdated = false;

  campusForm = new FormGroup({ //Necesario para la actualización dinámica del formulario
    nombre: new FormControl(''),
    direccion: new FormControl(''),
    fechaini: new FormControl(''),
    fechafin: new FormControl('')
  });

  constructor(public campusService: CampusService, private userService: UserService, private monitorService:MonitorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.subscribe((params) => {
      this.id = params['idcampus'];
    }); //Extraemos el id del campus de la url

    this.campusService.getCampus(this.id); //Cargamos el campus mediante el ID de la url

    this.campusService.getCampusListener().subscribe(newCampus => { //Cargamos la info del campus en el formulario
      this.campusForm.setValue({
        nombre: newCampus.nombre,
        direccion: newCampus.direccion,
        fechaini: newCampus.fechaini,
        fechafin: newCampus.fechafin
      });
      this.campusService.getGruposList(); //Precargamos lista de grupos y de monitores para las secciones
      this.monitorService.getMonitorList();
    });

  }

  ngAfterViewInit() {
    
  }

  onCampusUpdate() {
    this.campusService.updateCampus(this.campusService.campus.idcampus, this.campusForm.value.nombre, this.campusForm.value.direccion, new Date(this.campusForm.value.fechaini), new Date(this.campusForm.value.fechafin));
    this.campusUpdated = true;
  }

}