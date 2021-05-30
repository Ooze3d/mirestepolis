import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable()
export class UserInterceptor implements HttpInterceptor { //This class intercepts all outgoing requests and adds the security token to the header

    constructor(private userService:UserService) {}

    intercept(req:HttpRequest<any>, next:HttpHandler) { 
        const userToken = this.userService.getToken(); //Works even when the token is empty
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + userToken)
        });
        return next.handle(authRequest);
    }

}