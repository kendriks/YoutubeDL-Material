import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  validateRegistration(username: string, password: string, passwordConfirmation: string): {valid: boolean; error?: string} {
    if (!username || username === '') {
      return { valid: false, error: 'User name is required!' };
    }

    if (!password || password === '') {
      return { valid: false, error: 'Password is required!' };
    }

    if (!passwordConfirmation || passwordConfirmation === '') {
      return { valid: false, error: 'Password confirmation is required!' };
    }

    if (password !== passwordConfirmation) {
      return { valid: false, error: 'Password confirmation is incorrect!' };
    }

    return { valid: true };
  }

  validateLogin(password: string): {valid: boolean; error?: string} {
    if (password === '') {
      return { valid: false, error: 'Password is required!' };
    }
    return { valid: true };
  }
}
