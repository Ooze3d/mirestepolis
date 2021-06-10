import { formatNumber } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampusService } from 'src/app/campus.service';
import { Inscripcion } from 'src/app/inscripcion.model';
import { InscripcionService } from 'src/app/inscripcion.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit, AfterViewInit {

  busca: string = '';
  listaFiltered: Inscripcion[] = [];

  constructor(public campusService: CampusService, public inscripcionService: InscripcionService, public userService: UserService, private route: ActivatedRoute) { }

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
    this.inscripcionService.getInscripcionListListener().subscribe(list => {
      this.listaFiltered = list.sort(this.compara);
    });
  }

  buscaPeque() {
    this.listaFiltered = [];
    this.listaFiltered = this.inscripcionService.inscripcionList.filter(
      x => {
        return x.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.busca.toLowerCase()) || //Avoid accents in the search
          x.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.busca.toLowerCase())
      });
    this.inscripcionService.inscripcionList.forEach(x => { //Too many!!
      let found = false;
      x.famList.forEach(fam => {
        if(fam.dni.toLowerCase().includes(this.busca.toLowerCase())) {
          found = true;
          return;
        } 
      });
      if(found && !this.listaFiltered.includes(x))
        this.listaFiltered.push(x);
    });
    this.listaFiltered.sort(this.compara);
  }

  compara(a: Inscripcion, b: Inscripcion) {
    return a.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') <= b.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')? -1 : 1;
  }

}
