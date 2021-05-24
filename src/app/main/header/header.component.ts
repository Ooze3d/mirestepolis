import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { CampusService } from '../../campus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userStatusSub?:Subscription;

  constructor(public campusService:CampusService, public userService:UserService) { }

  ngOnInit(): void {
    this.userService.checkLogin();
  }

  onLogout() {
    this.userService.logout();
  }

}
