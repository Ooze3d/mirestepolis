import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MonitorService } from '../../../monitor.service';
import { UserService } from '../../../user.service';
import { DialogService } from 'dialog-service';
import { CampusService } from 'src/app/campus.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-monitores',
  templateUrl: './monitores.component.html',
  styleUrls: ['./monitores.component.css']
})
export class MonitoresComponent implements OnInit, AfterViewInit, OnDestroy {

  borrar:boolean = false;
  justDeleted:boolean = false;
  destroyed: Subject<void> = new Subject<void>();

  constructor(public monitorService:MonitorService, public campusService:CampusService, public userService:UserService, private changes:ChangeDetectorRef, private dialog: DialogService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.userService.checkLogin();
    this.route.params.pipe(takeUntil(this.destroyed)).subscribe((params) => {
      let id = params['idcampus'];
      if(this.campusService.campus.idcampus!=id) { //Checks the url for the campus and compares it to the service in case the page gets refreshed
        this.campusService.getCampus(id);
        this.campusService.getCampusListener().pipe(takeUntil(this.destroyed)).subscribe(() => {
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
    this.dialog.withConfirm('Estás seguro de que quieres borrar el monitor?', {content: '¡Se borrarán todas las actividades asociadas!', acceptButton: 'Sí', cancelButton: 'No'}).pipe(takeUntil(this.destroyed)).subscribe(response => {
      if(response) {
        this.monitorService.deleteMonitor(dni);
        this.borrar = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}