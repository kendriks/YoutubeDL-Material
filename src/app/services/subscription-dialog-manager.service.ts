import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubscribeDialogComponent } from 'app/dialogs/subscribe-dialog/subscribe-dialog.component';
import { SubscriptionInfoDialogComponent } from 'app/dialogs/subscription-info-dialog/subscription-info-dialog.component';
import { EditSubscriptionDialogComponent } from 'app/dialogs/edit-subscription-dialog/edit-subscription-dialog.component';
import { SubscriptionData } from './subscription-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDialogManagerService {

  constructor(private dialog: MatDialog) { }

  openSubscribeDialog(): Observable<SubscriptionData | null> {
    return new Observable(observer => {
      const dialogRef = this.dialog.open(SubscribeDialogComponent, {
        maxWidth: 500,
        width: '80vw'
      });

      dialogRef.afterClosed().subscribe(result => {
        observer.next(result || null);
        observer.complete();
      });
    });
  }

  openSubInfoDialog(sub: SubscriptionData): Observable<boolean> {
    return new Observable(observer => {
      const unsubbedEmitter = new EventEmitter<boolean>();
      const dialogRef = this.dialog.open(SubscriptionInfoDialogComponent, {
        data: {
          sub: sub,
          unsubbedEmitter: unsubbedEmitter
        }
      });

      unsubbedEmitter.subscribe(success => {
        observer.next(success);
        observer.complete();
      });
    });
  }

  openEditSubscriptionDialog(sub: SubscriptionData): MatDialogRef<EditSubscriptionDialogComponent> {
    return this.dialog.open(EditSubscriptionDialogComponent, {
      data: { sub: sub }
    });
  }
}
