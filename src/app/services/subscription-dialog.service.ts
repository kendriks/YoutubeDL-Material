import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArgModifierDialogComponent } from 'app/dialogs/arg-modifier-dialog/arg-modifier-dialog.component';
import { Subscription } from './subscription-management.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDialogService {

  constructor(private dialog: MatDialog) { }

  openArgsModifierDialog(currentArgs: string): Promise<string | null> {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(ArgModifierDialogComponent, {
        data: { initial_args: currentArgs }
      });

      dialogRef.afterClosed().subscribe(newArgs => {
        if (newArgs !== null && newArgs !== undefined) {
          resolve(newArgs);
        } else {
          resolve(null);
        }
      });
    });
  }

  async updateCustomArgs(sub: Subscription): Promise<void> {
    if (!sub.custom_args) {
      sub.custom_args = '';
    }
    const newArgs = await this.openArgsModifierDialog(sub.custom_args);
    if (newArgs !== null) {
      sub.custom_args = newArgs;
    }
  }
}
