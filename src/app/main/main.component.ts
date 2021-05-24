import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CampusService } from '../campus.service';
import { UserService } from '../user.service';
import { DialogService } from 'dialog-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

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
    this.dialog.withConfirm('Estás seguro de que quieres borrar el campus?').subscribe(response => {
      if(response) {
        this.campusService.deleteCampus(idcampus);
        this.borrar = false;
        this.changes.detectChanges();
      }
    });
  }

}
