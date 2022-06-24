import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class Constants {

    public static url:string = 'http://185.167.96.163:3000/api/';
    //public static url:string = 'http://localhost:3000/api/';

    constructor() {}

}