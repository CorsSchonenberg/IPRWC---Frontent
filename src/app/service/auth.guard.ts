import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {UserService} from "./user.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    if (this.userService.getUser() !== null) {
      return true;
    } else {
      return this.router.createUrlTree(['/']);
    }


  }
}
