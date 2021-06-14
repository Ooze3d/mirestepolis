import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusService } from './campus.service';
import { MonitorService } from './monitor.service';

@Injectable({ providedIn: 'root' })
export class UserService implements OnInit {

    error: string = '';
    exito: string = '';
    user: User = new User('Anonimo', '0000');
    login: boolean = false;
    justLoggedOut: boolean = false;
    private token: string = '';
    private userStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private campusService: CampusService, private monitorService: MonitorService) {

    }

    ngOnInit() {

    }

    isAdmin():boolean {
        return localStorage.getItem('level')=='admin';
    }

    isMonitor(): boolean {
        return localStorage.getItem('level')=='monitor';
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
        this.http.post<{ message: string }>('http://185.167.96.163:3000/api/usuarios/signup', this.user).subscribe((response) => {
            this.exito = response.message;
            setTimeout(() => {
                this.exito = '';
            }, 3000);
        }, (error) => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
        });
    }

    loginUser(user: string, password: string) {
        this.user = new User(user, password);
        this.http.post<{ token: string, expiresIn: number, user:string, level:string }>('http://185.167.96.163:3000/api/usuarios/login', this.user).subscribe((userBack) => {
            this.token = userBack.token;
            const expiresInDuration = userBack.expiresIn;
            this.login = true;
            this.user.level = userBack.level; //Saving user info to localStorage
            localStorage.setItem('user', userBack.user);
            localStorage.setItem('level', userBack.level);
            this.userStatusListener.next(this.login); //Once the user is logged in, that info is sent to the rest of the app
            const now = new Date(); //Setup for token expiration
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(userBack.token, expirationDate);
            this.router.navigate(['/main']);
        }, (error) => {
            this.error = error.error.error;
            setTimeout(() => {
                this.error = '';
            }, 3000);
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
            this.user.level = localStorage.getItem('level') || '';
        } else {
            this.clearAuthData(); //Just in case, if the token is no longer valid, deletes all info
        }
    }

    logout() {
        this.clearAuthData(); //Deletes all previous login info
        this.router.navigate(['/login']);
        this.justLoggedOut = true;
        setTimeout(() => {
            this.justLoggedOut = false;
        }, 3000);
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
        localStorage.removeItem('fechaAct');
        localStorage.removeItem('level');
    }

}