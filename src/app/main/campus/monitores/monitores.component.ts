import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MonitorService } from '../../../monitor.service';
import { UserService } from '../../../user.service';
import { DialogService } from 'dialog-service';
import { CampusService } from 'src/app/campus.service';

@Component({
  selector: 'app-monitores',
  templateUrl: './monitores.component.html',
  styleUrls: ['./monitores.component.css']
})
export class MonitoresComponent implements OnInit, AfterViewInit {

  borrar:boolean = false;
  justDeleted:boolean = false;

  constructor(public monitorService:MonitorService, public campusService:CampusService, public userService:UserService, private changes:ChangeDetectorRef, private dialog: DialogService) {

  }

  ngOnInit() {
    this.userService.checkLogin();
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

}