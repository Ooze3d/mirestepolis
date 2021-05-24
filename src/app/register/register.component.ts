import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public userService:UserService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
  }

  onRegister(f:NgForm) {
    if(f.invalid)
      return;
    this.userService.addUser(f.value.user, f.value.password, f.value.level);
  }

}
