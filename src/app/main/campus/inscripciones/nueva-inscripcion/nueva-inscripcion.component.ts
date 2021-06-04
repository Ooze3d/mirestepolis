import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CampusService } from 'src/app/campus.service';
import { Familiar } from 'src/app/familiar.model';
import { Inscripcion } from 'src/app/inscripcion.model';
import { InscripcionService } from 'src/app/inscripcion.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-nueva-inscripcion',
  templateUrl: './nueva-inscripcion.component.html',
  styleUrls: ['./nueva-inscripcion.component.css']
})
export class NuevaInscripcionComponent implements OnInit, AfterViewInit, OnDestroy {

  dni:FormControl = new FormControl();
  inscripcionAdded: boolean = false;
  nombreInscripcion: string = '';
  tipoFamList: string[] = ['Madre', 'Padre', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Tutor', 'Otro/a'];
  famList: Familiar[] = []; //List of family members for this subscription
  filteredFamList: Familiar[] = []; //List of possible family members filtered from the list of all family members in the database

  constructor(private userService: UserService, public campusService: CampusService, private route: ActivatedRoute, public inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().subscribe(() => {
          this.campusService.getGruposList();
          this.inscripcionService.getInscripcionList();
          this.inscripcionService.getFamList();
        });
      } else {
        this.inscripcionService.getInscripcionList();
        this.inscripcionService.getFamList();
      }
    });
  }

  ngAfterViewInit(): void {
    this.inscripcionService.getInscripcionListListener();
    this.inscripcionService.getFamListListener().subscribe(() => {
      console.log(this.inscripcionService.allFamList);
    });
  }

  onNewInscripcion(f: NgForm) {
    if (f.invalid)
      return;
    else if(this.famList.length==0) {
      this.inscripcionService.error = 'Introduce al menos un familiar en la lista';
      setTimeout(() => {
        this.inscripcionService.error = '';
      }, 3000);
      return;
    } else {
      let matriculapeque:string = f.value.nombre.trim().substr(0,3)+f.value.apellidos.trim().substr(0,3)+Math.round(Math.random()*899+100);
      this.inscripcionService.inscripcion = new Inscripcion(f.value.nombre, f.value.apellidos, f.value.fechanac.toISOString(), f.value.aulamat | 0, f.value.comedor | 0, f.value.postcom | 0, f.value.idgrupo);
      this.inscripcionService.inscripcion.matricula = matriculapeque;
      this.inscripcionService.addInscripcion();
      this.inscripcionService.getInscripcionListListener().subscribe(() => {
        this.famList.forEach(fam => {
          console.log('Introduciendo: '+fam.nombre);
          this.inscripcionService.familiar = fam;
          this.inscripcionService.addFamiliar();
        });
      });
    }
  }

  onNewFam(f: NgForm) {
    if (f.invalid)
      return;
    else if (this.validaNif(this.dni.value)) { //TODO check for duplicate in full list
      if(!this.famList.find(x => x.dni.toLowerCase()===this.dni.value.toLowerCase())) {
        this.famList.push(new Familiar(this.dni.value, f.value.nombre, f.value.apellidos, f.value.telefono, f.value.email, f.value.tipofam, f.value.esprincipal | 0));
        f.resetForm();
        this.dni.reset();
      } else {
        this.inscripcionService.error = 'El familiar ya está en la lista';
        setTimeout(() => {
          this.inscripcionService.error = '';
        }, 3000);
      }
    } else {
      this.dni.setErrors({ 'incorrect': true });
      return;
    }
  }

  deleteFam(id:number) {
    this.famList.splice(id, 1);
  }

  filterFamList() {
    this.filteredFamList = this.inscripcionService.allFamList.filter(x => x.dni.toLowerCase().includes(this.dni.value.toLowerCase()));
  }

  rellenaFam() {
    let fam:Familiar = this.inscripcionService.allFamList.filter(x => x.dni.toLowerCase().includes(this.dni.value.toLowerCase()))[0];
  }

  validaNif(docu: string) { //DNI letter validator
    let codigo: string[] = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
    docu = docu.trim();
    if (docu.length != 9) {
      return false;
    } else {
      let letra: string = docu.slice(-1);
      let numeros: number = Number(docu.slice(0, 8));
      if (Number(numeros) == NaN)
        return false;
      else if (codigo[Number(numeros) % 23] == letra)
        return true;
    }
    return false;
  }

  checkForPrincipal(): boolean {
    return this.famList.find(x => x.esprincipal)!=undefined;
  }

  ngOnDestroy(): void {
    /*this.campusService.getCampusListener().unsubscribe();
    this.inscripcionService.getFamListListener().unsubscribe();
    this.inscripcionService.getInscripcionListListener().unsubscribe();*/
  }
}
