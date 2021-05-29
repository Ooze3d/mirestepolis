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
    
  }

  onLoginRequest(f:NgForm) {
    if(f.invalid)
      return;
    this.userService.loginUser(f.value.user, f.value.password);
  }

}
