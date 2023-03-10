import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {AuthService} from "../service/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../models/user.model";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginSubscription: Subscription;
  infoSubscription: Subscription;
  public showPassword: boolean = false;
  @ViewChild('f') signinForm: NgForm;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  onSubmit() {
    let credentials = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };
    this.loginSubscription = this.authService.loginHandler(credentials).subscribe(() => {
      this.infoSubscription = this.authService.infoHandler().subscribe(data => {
        const user = new User(
          data.id,
          data.email,
          data.password,
          data.admin,
          data.address
        );
        this.userService.setUser(user);
        this.infoSubscription.unsubscribe();
        this.router.navigate(['/shop'])
        return this._snackBar.open("Succesfully logged in!", 'Nice!', {
          duration: 3000,
          horizontalPosition: 'right'
        });
      }, error => {
        if (error['status'] === 401){
          return this._snackBar.open("Error: 401 Unauthorized", 'Oh no..', {
            duration: 3000,
            horizontalPosition: 'right'
          });
        }
        if (error['statusText'] == "Unknown Error") {
          return this._snackBar.open("Error: 404 Not Found", 'Oh no..', {
            duration: 3000,
            horizontalPosition: 'right'
          });
        } else {
          return this._snackBar.open(error, 'Oh no..', {
            duration: 3000,
            horizontalPosition: 'right'
          });
        }
      });
      this.loginSubscription.unsubscribe();
    }, error => {
      if (error['status'] === 401){
        return this._snackBar.open("Error: 401 Unauthorized", 'Oh no..', {
          duration: 3000,
          horizontalPosition: 'right'
        });
      }
      if (error['statusText'] == "Unknown Error") {
        return this._snackBar.open('Error: 404 Not Found', 'Oh no..', {
          duration: 3000,
          horizontalPosition: 'right'
        });
      } else {
        return this._snackBar.open(error, 'Oh no..', {
          duration: 3000,
          horizontalPosition: 'right'
        });
      }
    });
  }


  ngOnInit(): void {

  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
