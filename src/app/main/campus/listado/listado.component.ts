import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'dialog-service';
import { CampusService } from 'src/app/campus.service';
import { Inscripcion } from 'src/app/inscripcion.model';
import { InscripcionService } from 'src/app/inscripcion.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit, AfterViewInit {

  busca: string = '';
  listaFiltered: Inscripcion[] = [];
  editar: boolean = false;
  fecha: Date = new Date(new Date().getTime() + (2 * 60 * 60 * 1000)); //Compensando la zona horaria

  constructor(public campusService: CampusService, public inscripcionService: InscripcionService, public userService: UserService, private route: ActivatedRoute, private dialog: DialogService, private changes: ChangeDetectorRef) { }

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
    this.inscripcionService.inscripcionList.forEach(x => { //Exclusive for family members DNI
      let found = false;
      x.famList.forEach(fam => {
        if (fam.dni.toLowerCase().includes(this.busca.toLowerCase())) { //Find DNI match
          found = true;
          return;
        }
      });
      if (found && !this.listaFiltered.includes(x)) //If not already in the list, add it
        this.listaFiltered.push(x);
    });
    this.listaFiltered.sort(this.compara);
  }

  compara(a: Inscripcion, b: Inscripcion) {
    return a.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') <= b.apellidos.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ? -1 : 1;
  }

  onEntrada() {

  }

  onSalida(f:NgForm) {
    
  }

}
