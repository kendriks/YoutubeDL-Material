import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from 'api-types';
import { TaskManagementService } from './task-management.service';
import { TaskDataSourceService } from './task-data-source.service';
import { PostsService } from 'app/posts.services';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private tasks: Task[] = null;
  private dataSource: MatTableDataSource<Task> = null;
  private dbBackups: string[] = [];
  private intervalId: number = null;

  constructor(
    private taskManagementService: TaskManagementService,
    private taskDataSourceService: TaskDataSourceService,
    private postsService: PostsService
  ) { }

  startPolling(intervalMs: number, callback: () => void): void {
    this.loadTasks(callback);
    this.intervalId = window.setInterval(() => this.loadTasks(callback), intervalMs);
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  loadTasks(callback?: () => void): void {
    this.taskManagementService.getTasks().subscribe(tasks => {
      const processedTasks = this.processTaskTitles(tasks);
      this.updateTasksState(processedTasks);
      if (callback) callback();
    });
  }

  loadDBBackups(): void {
    this.taskManagementService.getDBBackups().subscribe(backups => {
      this.dbBackups = backups;
    });
  }

  private processTaskTitles(tasks: Task[]): Task[] {
    const downloaderName = this.postsService.config.Advanced.default_downloader;
    return tasks.map(task => 
      this.taskManagementService.replaceDownloaderInTaskTitle(task, downloaderName)
    );
  }

  private updateTasksState(processedTasks: Task[]): void {
    if (this.tasks) {
      if (this.taskManagementService.tasksAreEqual(this.tasks, processedTasks)) return;
      this.tasks = this.taskManagementService.updateExistingTasks(this.tasks, processedTasks);
      this.dataSource = this.taskDataSourceService.updateDataSource(this.dataSource, this.tasks);
    } else {
      this.tasks = processedTasks;
    }
  }

  initializeDataSource(paginator: MatPaginator, sort: MatSort): void {
    if (this.tasks && !this.dataSource) {
      this.dataSource = this.taskDataSourceService.initializeDataSource(this.tasks, paginator, sort);
    }
  }

  getDataSource(): MatTableDataSource<Task> {
    return this.dataSource;
  }

  getDBBackups(): string[] {
    return this.dbBackups;
  }
}
