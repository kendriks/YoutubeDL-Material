import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/dialogs/confirm-dialog/confirm-dialog.component';
import { RestoreDbDialogComponent } from 'app/dialogs/restore-db-dialog/restore-db-dialog.component';
import { UpdateTaskScheduleDialogComponent } from 'app/dialogs/update-task-schedule-dialog/update-task-schedule-dialog.component';
import { TaskSettingsComponent } from '../components/task-settings/task-settings.component';
import { Task, TaskType } from 'api-types';
import { Observable } from 'rxjs';

interface DialogData {
  dialogTitle: string;
  dialogText: string;
  submitText: string;
  warnSubmitColor: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDialogService {

  private readonly TASKS_REQUIRING_CONFIRMATION: { [key in TaskType]?: DialogData } = {
    [TaskType.REBUILD_DATABASE]: {
      dialogTitle: $localize`Rebuild database`,
      dialogText: $localize`Are you sure you want to rebuild the database? All missing users, subscriptions, and files will be reimported. Note that if missing users are detected, they will be created with the password: 'password'. A backup of your current database will be created.`,
      submitText: $localize`Rebuild database`,
      warnSubmitColor: false
    }
  };

  constructor(private dialog: MatDialog) { }

  openConfirmationDialog(taskKey: TaskType): Observable<boolean> {
    const dialogData = this.TASKS_REQUIRING_CONFIRMATION[taskKey];
    if (!dialogData) {
      return null;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: dialogData.dialogTitle,
        dialogText: dialogData.dialogText,
        submitText: dialogData.submitText,
        warnSubmitColor: dialogData.warnSubmitColor
      }
    });

    return dialogRef.afterClosed();
  }

  openScheduleDialog(task: Task): Observable<string | null> {
    const dialogRef = this.dialog.open(UpdateTaskScheduleDialogComponent, {
      data: { task }
    });

    return dialogRef.afterClosed();
  }

  openTaskSettingsDialog(task: Task): void {
    this.dialog.open(TaskSettingsComponent, {
      data: { task }
    });
  }

  openRestoreDBDialog(dbBackups: string[]): void {
    this.dialog.open(RestoreDbDialogComponent, {
      data: { db_backups: dbBackups },
      width: '80vw'
    });
  }

  openResetTasksDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: $localize`Reset tasks`,
        dialogText: $localize`Would you like to reset your tasks? All your schedules will be removed as well.`,
        submitText: $localize`Reset`,
        warnSubmitColor: true
      }
    });

    return dialogRef.afterClosed();
  }

  openErrorDialog(task: Task): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: $localize`Error for: ${task.title}`,
        dialogText: task.error,
        submitText: $localize`Copy to clipboard`,
        cancelText: $localize`Close`,
        closeOnSubmit: false,
        onlyEmitOnDone: true
      }
    });
  }

  requiresConfirmation(taskKey: TaskType): boolean {
    return !!this.TASKS_REQUIRING_CONFIRMATION[taskKey];
  }
}
