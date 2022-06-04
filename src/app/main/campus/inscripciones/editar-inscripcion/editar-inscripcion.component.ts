import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Alergia } from 'src/app/alergia.model';
import { CampusService } from 'src/app/campus.service';
import { Familiar } from 'src/app/familiar.model';
import { DialogService } from 'dialog-service';
//import { Inscripcion } from 'src/app/inscripcion.model';
import { InscripcionService } from 'src/app/inscripcion.service';
import { Pago } from 'src/app/pago.model';
import { Trastorno } from 'src/app/trastorno.model';
import { UserService } from 'src/app/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editar-inscripcion',
  templateUrl: './editar-inscripcion.component.html',
  styleUrls: ['./editar-inscripcion.component.css']
})
export class EditarInscripcionComponent implements OnInit, AfterViewInit, OnDestroy { //TODO finish component

  dni: FormControl = new FormControl();
  alergia: FormControl = new FormControl();
  trastorno: FormControl = new FormControl();
  famForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tipofam: new FormControl('', [Validators.required]),
    esprincipal: new FormControl('')
  });

  inscripcionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    fechanac: new FormControl('', [Validators.required]),
    pagada: new FormControl('', [Validators.required]),
    idgrupo: new FormControl('', [Validators.required]),
    esprincipal: new FormControl('')
  });

  tipoFamList: string[] = ['Madre', 'Padre', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Tutor', 'Otro/a'];
  filteredFamList: Familiar[] = []; //List of possible family members filtered from the list of all family members in the database
  filteredAleList: Alergia[] = [];
  filteredTrasList: Alergia[] = [];
  destroyed: Subject<void> = new Subject<void>();


  constructor(private userService: UserService, public campusService: CampusService, private route: ActivatedRoute, public inscripcionService: InscripcionService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.inscripcionService.getAlergiasList();
    this.inscripcionService.getTrastornosList();
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      let id = params['idcampus'];
      let matricula = params['matricula']
      if (this.campusService.campus.idcampus != id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
          this.campusService.getGruposList();
          this.campusService.getDiasList();
          this.inscripcionService.getInscripcionList();
          this.inscripcionService.getFamList();
          this.inscripcionService.getInscripcion(matricula);
        });
      } else {
        this.campusService.getDiasList();
        this.inscripcionService.getInscripcionList();
        this.inscripcionService.getFamList();
        this.inscripcionService.getInscripcion(matricula);
      }
    });
  }

  ngAfterViewInit(): void {
    this.inscripcionService.getInscripcionListener().pipe(takeUntil(this.destroyed)).subscribe(inscripcion => {
      let pagada = '';
      if (inscripcion.pagada == 1)
        pagada = 'p';
      else if (inscripcion.regalada == 1)
        pagada = 'r';

      this.inscripcionForm.patchValue({
        nombre: inscripcion.nombre,
        apellidos: inscripcion.apellidos,
        fechanac: inscripcion.fechanac,
        pagada: pagada,
        idgrupo: inscripcion.idgrupo
      });
      //console.log(this.inscripcionService.inscripcion);
    });
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

  /*
    NOTA: La edición del niño requiere una gran cantidad de modificaciones.
    Si cambiamos alergias, trastornos o familiares, hay que eliminar las relaciones N:M y poner otras nuevas,
    y hay que hacerlo editando la base de datos en tiempo real mientras se está modificando el formulario o
    tendríamos que comparar dato por dato de las relaciones a la hora de guardar la información.
    Es por eso que al desarrollador le ha parecido más sencillo y con menos tendencia a errores borrar
    la suscripción, mantener el valor de matrícula y volver a añadir al niño correspondiente.
  */

  onEditInscripcion() { //Edits child
    let done: boolean = false;
    if (this.inscripcionForm.invalid) {
      this.inscripcionService.error = 'Comprueba que todos los campos de la inscripción están rellenos.';
      setTimeout(() => {
        this.inscripcionService.error = '';
      }, 3000);
      return;
    } else if (this.inscripcionService.inscripcion.famList.length == 0) { //Checks if the family members list is empty
      this.inscripcionService.error = 'Introduce al menos un familiar en la lista';
      setTimeout(() => {
        this.inscripcionService.error = '';
      }, 3000);
      return;
    } else {
      let matriculapeque: string = this.inscripcionService.inscripcion.matricula;
      let pagada: number = this.inscripcionForm.value.pagada == 'p' ? 1 : 0;
      let regalada: number = this.inscripcionForm.value.pagada == 'r' ? 1 : 0;

      this.inscripcionService.inscripcion.nombre = this.inscripcionForm.value.nombre; //All family members, allergies and conditions are already set (if a new object is created, those lists disappear)
      this.inscripcionService.inscripcion.apellidos = this.inscripcionForm.value.apellidos;
      try {
        this.inscripcionService.inscripcion.fechanac = this.inscripcionForm.value.fechanac.toISOString(); //Sometimes it will be a Date object, others it won't
      } catch (e) {
        this.inscripcionService.inscripcion.fechanac = this.inscripcionForm.value.fechanac;
      }

      this.inscripcionService.inscripcion.pagada = pagada;
      this.inscripcionService.inscripcion.regalada = regalada;
      this.inscripcionService.inscripcion.idgrupo = this.inscripcionForm.value.idgrupo;
      this.inscripcionService.inscripcion.matricula = matriculapeque;

      let size: number = this.inscripcionService.inscripcionList.length;

      this.inscripcionService.deleteInscripcion(this.inscripcionService.inscripcion.matricula);

      this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(list => {
        if(list.length < size) {
          this.inscripcionService.addInscripcion();
          this.inscripcionService.getInscripcionListListener().pipe(takeUntil(this.destroyed)).subscribe(() => { //Once the child is created, we can register family members
            this.inscripcionService.inscripcion.famList.forEach(fam => {
              this.inscripcionService.familiar = fam;
              this.inscripcionService.addFamiliar();
            });
            if (this.inscripcionService.inscripcion.alergias.length > 0) {
              this.inscripcionService.inscripcion.alergias.forEach(ale => { //Register allergies
                this.inscripcionService.newAlergia(ale.nombre, ale.descripcion);
              });
            }
            if (this.inscripcionService.inscripcion.trastornos.length > 0) {
              this.inscripcionService.inscripcion.trastornos.forEach(tras => { //And conditions
                this.inscripcionService.newTrastorno(tras.nombre, tras.descripcion);
              });
            }
            if (this.inscripcionService.inscripcion.payList.length > 0) {
              this.inscripcionService.inscripcion.payList.forEach(p => { //And paid days
                this.inscripcionService.newPaid(p);
              });
            }
            if (this.inscripcionService.inscripcion.dayList.length > 0) {
              this.inscripcionService.inscripcion.dayList.forEach(d => { //And days
                this.inscripcionService.addDia(d);
              });
            }
          });
        } else {
          console.log('Tried and failed!');
        }
      });
    }
  }

  onNewFam() { //Adds new family member to list
    if (this.famForm.invalid)
      return;
    else if (this.validaNif(this.dni.value)) { //TODO check for duplicate in full list
      if (!this.inscripcionService.inscripcion.famList.find(x => x.dni.toLowerCase() === this.dni.value.toLowerCase())) {
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

  deleteFam(id: number) { //Remove family member from form list
    this.inscripcionService.inscripcion.famList.splice(id, 1);
  }

  addAlergia() { //Adds allergy to list
    if (this.alergia.value != '' && !this.inscripcionService.inscripcion.alergias.find(alergia => alergia.nombre == this.alergia.value))
      this.inscripcionService.inscripcion.alergias.push(new Alergia(this.alergia.value));
  }

  deleteAle(id: number) { //Remove allergy from form list
    this.inscripcionService.inscripcion.alergias.splice(id, 1);
  }

  addTrastorno() { //Adds condition to list
    if (this.trastorno.value != '' && !this.inscripcionService.inscripcion.trastornos.find(trastorno => trastorno.nombre == this.trastorno.value))
      this.inscripcionService.inscripcion.trastornos.push(new Trastorno(this.trastorno.value));
  }

  deleteTras(id: number) { //Remove condition from list
    this.inscripcionService.inscripcion.trastornos.splice(id, 1);
  }

  rellenaFam() { //Fill the family member form with info from the main family members list
    if (this.inscripcionService.allFamList.find(x => x.dni.toLowerCase() === this.dni.value.toLowerCase())) {
      this.inscripcionService.familiar = this.inscripcionService.allFamList.find(x => x.dni.toLowerCase() === this.dni.value.toLowerCase())!;
      this.famForm.patchValue({
        nombre: this.inscripcionService.familiar.nombre,
        apellidos: this.inscripcionService.familiar.apellidos,
        telefono: this.inscripcionService.familiar.telefono,
        email: this.inscripcionService.familiar.email
      });
    }
  }

  rellenaFamMatricula(dni: string) { //Fill the family member form with info from the child's family members list
    if (this.inscripcionService.inscripcion.famList.find(x => x.dni.toLowerCase() === dni.toLowerCase())) {
      this.inscripcionService.familiar = this.inscripcionService.inscripcion.famList.find(x => x.dni.toLowerCase() === dni.toLowerCase())!;
      this.dni.patchValue(this.inscripcionService.familiar.dni);
      this.famForm.patchValue({
        nombre: this.inscripcionService.familiar.nombre,
        apellidos: this.inscripcionService.familiar.apellidos,
        telefono: this.inscripcionService.familiar.telefono,
        email: this.inscripcionService.familiar.email,
        tipofam: this.inscripcionService.familiar.tipofam,
        esprincipal: this.inscripcionService.familiar.esprincipal
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
    this.inscripcionService.getInscripcionListener().pipe(takeUntil(this.destroyed)).subscribe(inscripcion => {
      if (inscripcion.famList != undefined)
        return inscripcion.famList.find(x => x.esprincipal) != undefined;
      return false;
    });
    return false;
  }

  isSunday(dia: string): boolean {
    return new Date(dia).toLocaleString('default', { weekday: 'long' }) == 'domingo';
  }

  extractMonth(dia: string): number {
    return new Date(dia).getMonth();
  }

  onCheckDay(i: number) {
    let p: Pago | undefined;
    if(this.checkDayActive(this.campusService.daysList[i])) {
      p = this.inscripcionService.inscripcion.payList.find(x => x.fecha==this.campusService.daysList[i].toISOString());
    }
    let lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.dialog.withForm(
      this.campusService.daysList[i].getDate()+' de '+lista[this.campusService.daysList[i].getMonth()],
      [
        { title: 'Activo', type: 'switch', value: (p!=undefined) },
        { title: 'Aula Matinal', type: 'switch', value: (p?.aulamat!=undefined && p.aulamat==1)},
        { title: 'Comedor', type: 'switch', value: (p?.comedor!=undefined && p.comedor==1)},
        { title: 'Post Comedor', type: 'switch', value: (p?.postcom!=undefined && p.postcom==1)}
      ],
      {
        content: 'Indica los servicios contratados:',
        layout: {
          flexCell: true,
          gutter: true,
          growItems: true
        }
      }
    ).subscribe(result => {
      if(result.activo==true) {
        let pago = new Pago(this.campusService.daysList[i].toISOString(), this.inscripcionService.inscripcion.matricula);
        pago.aulamat = result.aulaMatinal;
        pago.comedor = result.comedor;
        pago.postcom = result.postComedor;
        if(this.checkDayActive(this.campusService.daysList[i]))
          this.inscripcionService.deletePaid(this.inscripcionService.inscripcion.matricula, this.campusService.daysList[i].toISOString().split('/').join('-').substr(0,10));
        this.inscripcionService.newPaid(pago);
      } else if(result.activo=='')
        this.inscripcionService.deletePaid(this.inscripcionService.inscripcion.matricula, this.campusService.daysList[i].toISOString().split('/').join('-').substr(0,10));
    });
  }

  checkDayActive(dia: Date): boolean {
    dia = new Date(dia.setHours(2,0,0,0));
    if(this.inscripcionService.inscripcion.payList!=undefined && this.inscripcionService.inscripcion.payList.find(x => x.fecha==dia.toISOString()) != undefined) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
