import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UserService implements OnInit {

    user:User = new User('Anonimo', '0000');
    login:boolean = false;
    justLoggedOut:boolean = false;
    private token:string = '';
    private userStatusListener = new Subject<boolean>();

    constructor(private http:HttpClient, private router:Router) {

    }

    ngOnInit() {
        
    }

    checkLogin() {
        if(!this.login)
            this.router.navigate(['/']);
    }

    getToken() {
        return this.token;
    }

    setToken(token:string) {
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

    loginUser(user:string, password:string) {
        this.user = new User(user, password);
        this.http.post<{token:string}>('http://localhost:3000/api/usuarios/login', this.user).subscribe((userBack) => {
            this.token = userBack.token;
            this.login = true;
            this.userStatusListener.next(this.login);
            this.router.navigate(['/main']);
        });
    }

    logout() {
        this.login = false;
        this.userStatusListener.next(this.login);
        this.token = '';
        this.router.navigate(['/']);
        this.justLoggedOut = true;
    }

}