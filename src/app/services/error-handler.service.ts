import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  getLoginErrorMessage(errorCode: number): string {
    if (errorCode === 401) {
      return 'User name or password is incorrect!';
    } else if (errorCode === 404) {
      return 'Login failed, cannot connect to the server.';
    } else {
      return 'Login failed, unknown error.';
    }
  }

  getRegistrationErrorMessage(err: any): string {
    if (err && err.error && typeof err.error === 'string') {
      return err.error;
    }
    return 'Failed to register user, unknown error.';
  }
}
