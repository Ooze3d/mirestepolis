import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Alergia } from 'src/app/alergia.model';
import { CampusService } from 'src/app/campus.service';
import { Familiar } from 'src/app/familiar.model';
import { InscripcionService } from 'src/app/inscripcion.service';
//import { Pago } from 'src/app/pago.model';
import { Trastorno } from 'src/app/trastorno.model';
import { UserService } from 'src/app/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nueva-inscripcion',
  templateUrl: './nueva-inscripcion.component.html',
  styleUrls: ['./nueva-inscripcion.component.css']
})
export class NuevaInscripcionComponent implements OnInit, AfterViewInit {

  dni:FormControl = new FormControl();
  alergia:FormControl = new FormControl();
  trastorno:FormControl = new FormControl();
  famForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tipofam: new FormControl('', [Validators.required]),
    esprincipal: new FormControl('')
  });

  tipoFamList: string[] = ['Madre', 'Padre', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Tutor', 'Otro/a'];
  filteredFamList: Familiar[] = []; //List of possible family members filtered from the list of all family members in the database
  filteredAleList: Alergia[] = [];
  filteredTrasList: Alergia[] = [];
  destroyed: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, public campusService: CampusService, private route: ActivatedRoute, public inscripcionService: InscripcionService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.inscripcionService.inscripcion.alergias = [];
    this.inscripcionService.inscripcion.famList = [];
    this.inscripcionService.inscripcion.trastornos = [];
    this.inscripcionService.getAlergiasList();
    this.inscripcionService.getTrastornosList();
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      let id = params['idcampus'];
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
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
    this.inscripcionService.getInscripcionListener();
    this.inscripcionService.getInscripcionListListener();
    this.inscripcionService.getAlergiasListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
      //console.log(this.inscripcionService.allAlergiasList);
    });
    this.inscripcionService.getTrastornosListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
      //console.log(this.inscripcionService.allTrastornosList);
    });
    this.inscripcionService.getFamListListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
      //console.log(this.inscripcionService.allFamList);
    });
  }

  onNewInscripcion(f: NgForm) { //Adds new child
    if (f.invalid)
      return;
    else if(this.inscripcionService.inscripcion.famList.length==0) { //Checks if the family members list is empty
      this.inscripcionService.error = 'Introduce al menos un familiar en la lista';
      setTimeout(() => {
        this.inscripcionService.error = '';
      }, 3000);
      return;
    } else {
      let matriculapeque:string = f.value.nombre.trim().substr(0,3)+f.value.apellidos.trim().substr(0,3)+Math.round(Math.random()*899+100); //Creates id
      matriculapeque = matriculapeque.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); //Avoids accents
      let pagada:number = f.value.pagada=='p'? 1 : 0;
      let regalada:number = f.value.pagada=='r'? 1 : 0;

      this.inscripcionService.inscripcion.nombre = f.value.nombre; //All family members, allergies and conditions are already set (if a new object is created, those lists disappear)
      this.inscripcionService.inscripcion.apellidos = f.value.apellidos;
      this.inscripcionService.inscripcion.fechanac = f.value.fechanac.toISOString();
      this.inscripcionService.inscripcion.pagada = pagada;
      this.inscripcionService.inscripcion.regalada = regalada;
      this.inscripcionService.inscripcion.idgrupo = f.value.idgrupo;
      this.inscripcionService.inscripcion.matricula = matriculapeque;

      this.inscripcionService.addInscripcion();

      this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(() => { //Once the child is created, we can register family members
        this.inscripcionService.inscripcion.famList.forEach(fam => {
          this.inscripcionService.familiar = fam;
          this.inscripcionService.addFamiliar();
        });
        this.inscripcionService.inscripcion.alergias.forEach(ale => { //Register allergies
          this.inscripcionService.newAlergia(ale.nombre, ale.descripcion);
        });
        this.inscripcionService.inscripcion.trastornos.forEach(tras => { //And conditions
          this.inscripcionService.newTrastorno(tras.nombre, tras.descripcion);
        });
      });
    }
  }

  onNewFam() { //Adds new family member to list
    if (this.famForm.invalid)
      return;
    else if (this.validaNif(this.dni.value)) { //TODO check for duplicate in full list
      if(!this.inscripcionService.inscripcion.famList.find(x => x.dni.toLowerCase()===this.dni.value.toLowerCase())) {
        this.inscripcionService.inscripcion.famList.push(new Familiar(this.dni.value, this.famForm.value.nombre, this.famForm.value.apellidos, this.famForm.value.telefono, this.famForm.value.email, this.famForm.value.tipofam, this.famForm.value.esprincipal | 0));
        this.famForm.reset();
      } else {
        this.inscripcionService.error = 'El familiar ya está en la lista';
        setTimeout(() => {
          this.inscripcionService.error = '';
        }, 3000);
      }
    } else {
      this.famForm.value.dni.setErrors({ 'incorrect': true });
      return;
    }
  }

  deleteFam(id:number) { //Remove family member from form list
    this.inscripcionService.inscripcion.famList.splice(id, 1);
  }

  addAlergia() { //Adds allergy to list
    if(this.alergia.value!='')
      this.inscripcionService.inscripcion.alergias.push(new Alergia(this.alergia.value));
  }

  deleteAle(id:number) { //Remove allergy from form list
    this.inscripcionService.inscripcion.alergias.splice(id, 1);
  }

  addTrastorno() { //Adds condition to list
    if(this.trastorno.value!='')
      this.inscripcionService.inscripcion.trastornos.push(new Trastorno(this.trastorno.value));
  }

  deleteTras(id:number) { //Remove condition from list
    this.inscripcionService.inscripcion.trastornos.splice(id, 1);
  }

  rellenaFam() { //Fill the family member form with info from the main family members list
    if(this.inscripcionService.allFamList.find(x => x.dni.toLowerCase()===this.dni.value.toLowerCase())) {
      this.inscripcionService.familiar = this.inscripcionService.allFamList.find(x => x.dni.toLowerCase()===this.dni.value.toLowerCase())!;
      this.famForm.patchValue({
        dni: this.inscripcionService.familiar.dni,
        nombre: this.inscripcionService.familiar.nombre,
        apellidos: this.inscripcionService.familiar.apellidos,
        telefono: this.inscripcionService.familiar.telefono,
        email: this.inscripcionService.familiar.email
      });
    }
  }

  filterFamList() { //Checks if the DNI the user is entering has a match in the main family members list
    this.filteredFamList = this.inscripcionService.allFamList.filter(x => x.dni.toLowerCase().includes(this.dni.value.toLowerCase()));
  }

  filterAleList() { //Checks if the allergy the user is entering has a match in the list
    this.filteredAleList = this.inscripcionService.allAlergiasList.filter(x => x.nombre.toLowerCase().includes(this.alergia.value.toLowerCase()));
  }

  filterTrasList() { //Checks if the condition the user is entering has a match in the list
    this.filteredTrasList = this.inscripcionService.allTrastornosList.filter(x => x.nombre.toLowerCase().includes(this.trastorno.value.toLowerCase()));
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

  checkForPrincipal(): boolean { //Checks if a certain family member is set as MAIN
    return this.inscripcionService.inscripcion.famList.find(x => x.esprincipal)!=undefined;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
