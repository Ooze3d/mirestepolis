import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable()
export class UserInterceptor implements HttpInterceptor { //Usamos el interceptor para adjuntar el token de autorización a todas las requests

    constructor(private userService:UserService) {}

    intercept(req:HttpRequest<any>, next:HttpHandler) { //Toma cualquier request y le añade el token en el header
        const userToken = this.userService.getToken(); //Si el token está vacío, funciona igual
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + userToken)
        });
        return next.handle(authRequest);
    }

}