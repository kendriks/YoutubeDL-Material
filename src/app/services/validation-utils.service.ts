import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationUtilsService {

  isEmptyOrSpaces(str: string): boolean {
    return str === null || str.match(/^ *$/) !== null;
  }

  isValidUserData(userData: {name?: string; role?: string}): boolean {
    return !!(userData && userData.name && userData.role && 
              !this.isEmptyOrSpaces(userData.name) && 
              !this.isEmptyOrSpaces(userData.role));
  }
}
