import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MonitorService } from '../../../monitor.service';
import { UserService } from '../../../user.service';
import { DialogService } from 'dialog-service';
import { CampusService } from 'src/app/campus.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monitores',
  templateUrl: './monitores.component.html',
  styleUrls: ['./monitores.component.css']
})
export class MonitoresComponent implements OnInit, AfterViewInit {

  borrar:boolean = false;
  justDeleted:boolean = false;

  constructor(public monitorService:MonitorService, public campusService:CampusService, public userService:UserService, private changes:ChangeDetectorRef, private dialog: DialogService, private route:ActivatedRoute) {

  }

  ngOnInit() {
    this.userService.checkLogin();
    this.route.params.subscribe((params) => {
      let id = params['idcampus'];
      if(this.campusService.campus.idcampus!=id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().subscribe(campus => {
          this.monitorService.getMonitorList();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.monitorService.getMonitorList();
  }

  deleteOn() {
    this.borrar = true;
  }

  deleteOff() {
    this.borrar = false;
  }

  deleteMonitor(dni:string) {
    this.dialog.withConfirm('Estás seguro de que quieres borrar el monitor?').subscribe(response => {
      if(response) {
        this.monitorService.deleteMonitor(dni);
        this.borrar = false;
        this.justDeleted = true;
        this.changes.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    //this.campusService.getCampusListener().unsubscribe();
  }

}