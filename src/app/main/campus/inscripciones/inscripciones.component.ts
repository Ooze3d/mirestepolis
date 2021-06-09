import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampusService } from 'src/app/campus.service';
import { InscripcionService } from 'src/app/inscripcion.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit, AfterViewInit {

  constructor(public campusService:CampusService, public inscripcionService:InscripcionService, public userService:UserService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().subscribe(() => {
          this.campusService.getGruposList();
          this.inscripcionService.getInscripcionList();
        });
      } else {
        this.inscripcionService.getInscripcionList();
      }
    });
  }

  ngAfterViewInit(): void {
    this.inscripcionService.getInscripcionListListener().subscribe(() => {
      console.log(this.inscripcionService.inscripcionList);
    });
  }

}
