import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccessMessage(message: string): void {
    this.openSnackBar(message);
  }

  showErrorMessage(message: string): void {
    this.openSnackBar(message, 'OK');
  }

  showDeleteConfirmation(name: string): void {
    this.openSnackBar(`${name} successfully deleted!`);
  }

  private openSnackBar(message: string, action = ''): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
