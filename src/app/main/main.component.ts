import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CampusService } from '../campus.service';
import { UserService } from '../user.service';
import { DialogService } from 'dialog-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  destroyed: Subject<void> = new Subject<void>();
  borrar:boolean = false;

  constructor(public campusService:CampusService, public userService:UserService, private changes:ChangeDetectorRef, private dialog: DialogService) {

  }

  ngOnInit() {
    this.userService.checkLogin();
    this.userService.justLoggedOut = false;
  }

  ngAfterViewInit() {
    this.campusService.getCampusList();
  }

  deleteOn() {
    this.borrar = true;
  }

  deleteOff() {
    this.borrar = false;
  }

  deleteCampus(idcampus:string) {
    this.dialog.withConfirm('Estás seguro de que quieres borrar el campus?', {content: '¡Se borrará toda la información asociada! (Grupos, Actividades, Inscripciones y Monitores)', acceptButton: 'Sí', cancelButton: 'No'}).pipe(takeUntil(this.destroyed)).subscribe(response => {
      if(response) {
        this.campusService.deleteCampus(idcampus);
        this.campusService.getCampusListListener().subscribe();
        this.borrar = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
