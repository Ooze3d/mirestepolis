import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { CampusService } from '../../campus.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MonitorService } from 'src/app/monitor.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit, AfterViewInit, OnDestroy {

  public id: string = '';
  destroyed: Subject<void> = new Subject<void>();

  campusForm = new FormGroup({ //FormGroup allows the form to be dynamically filled
    nombre: new FormControl(''),
    direccion: new FormControl(''),
    fechaini: new FormControl(''),
    fechafin: new FormControl('')
  });

  constructor(public campusService: CampusService, public userService: UserService, private monitorService:MonitorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.checkLogin();
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      this.id = params['idcampus'];
    }); //Checking if the campus on the service and the id on the url match

    this.campusService.getCampus(this.id); //If not, the campus from the url gets reloaded

    this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(newCampus => {  //Once the form is ready, we can fill the fields
      this.campusForm.setValue({
        nombre: newCampus.nombre,
        direccion: newCampus.direccion,
        fechaini: newCampus.fechaini,
        fechafin: newCampus.fechafin
      });
      this.campusService.getGruposList(); //Preload the list of groups and monitors 
      this.monitorService.getMonitorList();
    });

  }

  ngAfterViewInit(): void {
    
  }

  onCampusUpdate() {
    this.campusService.updateCampus(this.campusService.campus.idcampus, this.campusForm.value.nombre, this.campusForm.value.direccion, new Date(this.campusForm.value.fechaini), new Date(this.campusForm.value.fechafin));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}