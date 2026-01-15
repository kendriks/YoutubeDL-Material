import { Component, OnInit } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { FormValidationService } from 'app/services/form-validation.service';
import { ErrorHandlerService } from 'app/services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  selectedTabIndex = 0;

  // login
  loginUsernameInput = '';
  loginPasswordInput = '';
  loggingIn = false;

  // registration
  registrationEnabled = false;
  registrationUsernameInput = '';
  registrationPasswordInput = '';
  registrationPasswordConfirmationInput = '';
  registering = false;

  constructor(
    private postsService: PostsService,
    private snackBar: MatSnackBar,
    private rauthService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.postsService.service_initialized.subscribe(init => {
      if (init) {
        if (!this.authService.isMultiUserMode()) {
          this.router.navigate(['/home']);
        }
        this.registrationEnabled = this.authService.isRegistrationEnabled()
    }
    this.postsService.service_initialized.subscribe(init => {
      if (init) {
        if (!this.postsService.config['Advanced']['multi_user_mode']) {
          this.router.navigate(['/home']);
        }
        this.registrationEnabled = this.postsService.config['Users'] && this.postsService.config['Users']['allow_registration'];
      }
    });
  }

  login() {
    const validation = this.formValidationService.validateLogin(this.loginPasswordInput);
    if (!validation.valid) {
      return;
    }

    this.loggingIn = true;
    this.authService.login(this.loginUsernameInput, this.loginPasswordInput).subscribe(res => {
      this.loggingIn = false;
      if (res['token']) {
        this.authService.afterLogin(res['user'], res['token'], res['permissions'], res['available_permissions']);
      } else {
        this.openSnackBar('Login failed, unknown error.');
      }
    }, err => {
      this.loggingIn = false;
      const errorMessage = this.errorHandlerService.getLoginErrorMessage(err.status);
      this.openSnackBar(errorMessage);
    });
  }

  register() {
    if (!this.registrationUsernameInput || this.registrationUsernameInput === '') {
      this.openSnackBar('User name is required!');
      return;
    }
const validation = this.formValidationService.validateRegistration(
      this.registrationUsernameInput,
      this.registrationPasswordInput,
      this.registrationPasswordConfirmationInput
    );

    if (!validation.valid) {
      this.openSnackBar(validation.error);
      return;
    }

    this.registering = true;
    this.authService.register(this.registrationUsernameInput, this.registrationPasswordInput).subscribe(res => {
      this.registering = false;
      if (res && res['user']) {
        this.openSnackBar(`User ${res['user']['name']} successfully registered.`);
        this.loginUsernameInput = res['user']['name'];
        this.selectedTabIndex = 0;
      } else {
        this.openSnackBar('Failed to register user, unknown error.');
      }
    }, err => {
      this.registering = false;
      const errorMessage = this.errorHandlerService.getRegistrationErrorMessage(err);
      this.openSnackBar(errorMessage);
      if (!err.error || typeof err.error !== 'string')

  public openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
