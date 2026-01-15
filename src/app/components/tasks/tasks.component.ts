import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PostsService } from 'app/posts.services';
import { Task, TaskType } from 'api-types';
import { TaskDialogService } from 'app/services/task-dialog.service';
import { TaskOperationsService } from 'app/services/task-operations.service';
import { NotificationService } from 'app/services/notification.service';
import { TaskStateService } from 'app/services/task-state.service';
import { TaskErrorHandlerService } from 'app/services/task-error-handler.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['title', 'last_ran', 'last_confirmed', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private postsService: PostsService,
    private taskDialogService: TaskDialogService,
    private taskOperationsService: TaskOperationsService,
    private notificationService: NotificationService,
    public taskStateService: TaskStateService,
    private taskErrorHandlerService: TaskErrorHandlerService
  ) { }

  get dataSource() { return this.taskStateService.getDataSource(); }
  get db_backups() { return this.taskStateService.getDBBackups(); }

  ngOnInit(): void {
    const start = () => this.taskStateService.startPolling(1500, () => 
      this.taskStateService.initializeDataSource(this.paginator, this.sort));
    this.postsService.initialized ? start() : this.postsService.service_initialized.subscribe(init => init && start());
  }

  ngAfterViewInit(): void {
    this.taskStateService.initializeDataSource(this.paginator, this.sort);
  }

  ngOnDestroy(): void {
    this.taskStateService.stopPolling();
  }

  runTask(key: TaskType): void {
    this.taskOperationsService.executeTaskWithConfirmation(key,
      res => this.handleSuccess(res, 'Successfully ran task!', 'Failed to run task!', true),
      err => this.notificationService.showErrorMessage('Failed to run task!', err));
  }

  confirmTask(key: TaskType): void {
    this.taskOperationsService.confirmTaskOperation(key,
      res => this.handleSuccess(res, 'Successfully confirmed task!', 'Failed to confirm task!', false),
      err => this.notificationService.showErrorMessage('Failed to confirm task!', err));
  }

  private handleSuccess(res: {success: boolean}, successMsg: string, failMsg: string, loadBackups: boolean): void {
    this.taskStateService.loadTasks();
    if (loadBackups) this.taskStateService.loadDBBackups();
    this.notificationService.showConditionalMessage(res.success, successMsg, failMsg);
  }

  scheduleTask(task: Task): void {
    this.taskOperationsService.scheduleTaskOperation(task, () => this.taskStateService.loadTasks());
  }

  openTaskSettings(task: Task): void {
    this.taskDialogService.openTaskSettingsDialog(task);
  }

  openRestoreDBBackupDialog(): void {
    this.taskDialogService.openRestoreDBDialog(this.db_backups);
  }

  resetTasks(): void {
    this.taskOperationsService.resetTasksOperation(
      res => this.notificationService.showConditionalMessage(res.success, 'Tasks successfully reset!', 'Failed to reset tasks!'),
      err => this.notificationService.showErrorMessage('Failed to reset tasks!', err));
  }

  showError(task: Task): void {
    this.taskErrorHandlerService.handleErrorDisplay(task);
  }
}
