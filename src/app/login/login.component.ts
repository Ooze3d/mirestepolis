import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user:string = '';
  public password:string = '';

  constructor(public userService:UserService) { }

  ngOnInit(): void {
    localStorage.removeItem('fechaAct');
  }

  onLoginRequest(f:NgForm) {
    if(f.invalid) //If the form is invalid in any way, it returns and shows the errors
      return;
    this.userService.loginUser(f.value.user, f.value.password);
  }

}
