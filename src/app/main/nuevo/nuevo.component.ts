import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CampusService } from 'src/app/campus.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})

export class NuevoComponent implements OnInit {

  constructor(private userService:UserService, public campusService:CampusService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
  }

  onNewCampus(f:NgForm) {
    if(f.invalid)
      return;
    this.campusService.addCampus(f.value.nombre, f.value.direccion, f.value.fechaini, f.value.fechafin);
  }

}
