import { Component, Input } from '@angular/core';
import { Task } from 'api-types';

@Component({
  selector: 'app-task-status',
  template: `
    <span *ngIf="task.running || task.confirming">
      <mat-spinner matTooltip="Busy" i18n-matTooltip="Busy" [diameter]="25"></mat-spinner>
    </span>
    <span *ngIf="!(task.running || task.confirming) && task.schedule" style="display: flex">
      <ng-container i18n="Scheduled">Scheduled for</ng-container>
      {{task.next_invocation | date: 'short'}}
      <mat-icon style="font-size: 16px; display: inline-flex; align-items: center; padding-left: 5px; padding-bottom: 6px;" 
                *ngIf="task.schedule.type === 'recurring'">repeat</mat-icon>
    </span>
    <span *ngIf="!(task.running || task.confirming) && !task.schedule">
      <ng-container i18n="Not scheduled">Not scheduled</ng-container>
    </span>
  `
})
export class TaskStatusComponent {
  @Input() task: Task;
}
