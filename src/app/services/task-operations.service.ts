import { Injectable } from '@angular/core';
import { Task, TaskType } from 'api-types';
import { TaskManagementService } from './task-management.service';
import { TaskDialogService } from './task-dialog.service';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskOperationsService {

  constructor(
    private taskManagementService: TaskManagementService,
    private taskDialogService: TaskDialogService
  ) { }

  executeTaskWithConfirmation(
    taskKey: TaskType,
    onSuccess: (res: {success: boolean}) => void,
    onError: (err: unknown) => void
  ): void {
    if (this.taskDialogService.requiresConfirmation(taskKey)) {
      this.taskDialogService.openConfirmationDialog(taskKey).subscribe(confirmed => {
        if (confirmed) {
          this.executeTask(taskKey, onSuccess, onError);
        }
      });
    } else {
      this.executeTask(taskKey, onSuccess, onError);
    }
  }

  private executeTask(
    taskKey: TaskType,
    onSuccess: (res: {success: boolean}) => void,
    onError: (err: unknown) => void
  ): void {
    this.taskManagementService.runTask(taskKey).subscribe(onSuccess, onError);
  }

  confirmTaskOperation(
    taskKey: TaskType,
    onSuccess: (res: {success: boolean}) => void,
    onError: (err: unknown) => void
  ): void {
    this.taskManagementService.confirmTask(taskKey).subscribe(onSuccess, onError);
  }

  scheduleTaskOperation(task: Task, onComplete: () => void): void {
    this.taskDialogService.openScheduleDialog(task).subscribe(schedule => {
      if (schedule !== undefined) {
        this.taskManagementService.updateTaskSchedule(task.key, schedule).subscribe(() => onComplete());
      }
    });
  }

  resetTasksOperation(
    onSuccess: (res: {success: boolean}) => void,
    onError: (err: unknown) => void
  ): void {
    this.taskDialogService.openResetTasksDialog().subscribe(confirmed => {
      if (confirmed) {
        this.taskManagementService.resetTasks().subscribe(onSuccess, onError);
      }
    });
  }
}
