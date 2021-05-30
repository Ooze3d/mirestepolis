import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import { CampusService } from './campus.service';
import { MonitorService } from './monitor.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {

    user: User = new User('Anonimo', '0000');
    login: boolean = false;
    justLoggedOut: boolean = false;
    private token: string = '';
    private userStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private campusService: CampusService, private monitorService: MonitorService) {

    }

    ngOnInit() {

    }

    checkLogin() {
        this.autoAuthUser();
        if (!this.login)
            this.router.navigate(['/login']);
    }

    getToken() {
        return this.token;
    }

    setToken(token: string) {
        this.token = token;
    }

    getUserStatusListener() {
        return this.userStatusListener.asObservable();
    }

    addUser(user: string, password: string, level: string) {
        this.user = new User(user, password);
        this.user.level = level;
        this.http.post<JSON>('http://localhost:3000/api/usuarios/signup', this.user).subscribe((response) => {
            console.log(response);
        });
    }

    loginUser(user: string, password: string) {
        this.user = new User(user, password);
        this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/usuarios/login', this.user).subscribe((userBack) => {
            this.token = userBack.token;
            const expiresInDuration = userBack.expiresIn;
            this.login = true;
            localStorage.setItem('user', this.user.user);
            this.userStatusListener.next(this.login); //Once the user is logged in, that info is sent to the rest of the app
            const now = new Date(); //Setup for token expiration
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(userBack.token, expirationDate);
            this.router.navigate(['/main']);
        });
    }

    autoAuthUser() { //Checks LocalStorage for a valid, unexpired token and leaves 'session' open if found
        const authInformation = this.getAuthData();
        const now = new Date();
        if (authInformation && authInformation.expirationDate > now) {
            this.token = authInformation.token;
            this.login = true;
            this.userStatusListener.next(this.login);
            this.user.user = localStorage.getItem('user') || '';
        } else {
            this.clearAuthData(); //Just in case, if the token is no longer valid, deletes all info

        }
    }

    logout() {
        this.clearAuthData(); //Deletes all previous login info
        this.router.navigate(['/login']);
        this.justLoggedOut = true;
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate)
            return;
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    private clearAuthData() {
        this.login = false;
        this.userStatusListener.next(this.login);
        this.token = '';
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('login');
        localStorage.removeItem('idcampus');
        localStorage.removeItem('user');
    }

}