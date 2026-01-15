import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskType } from 'api-types';

interface TasksResponse {
  tasks: Task[];
}

interface DBBackupsResponse {
  db_backups: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  constructor(private postsService: PostsService) { }

  getTasks(): Observable<Task[]> {
    return this.postsService.getTasks().pipe(
      map((res: TasksResponse) => res.tasks)
    );
  }

  runTask(taskKey: TaskType): Observable<{success: boolean}> {
    return this.postsService.runTask(taskKey);
  }

  confirmTask(taskKey: TaskType): Observable<{success: boolean}> {
    return this.postsService.confirmTask(taskKey);
  }

  updateTaskSchedule(taskKey: TaskType, schedule: string): Observable<{success: boolean}> {
    return this.postsService.updateTaskSchedule(taskKey, schedule);
  }

  resetTasks(): Observable<{success: boolean}> {
    return this.postsService.resetTasks();
  }

  getDBBackups(): Observable<string[]> {
    return this.postsService.getDBBackups().pipe(
      map((res: DBBackupsResponse) => res.db_backups)
    );
  }

  replaceDownloaderInTaskTitle(task: Task, downloaderName: string): Task {
    if (task.title.includes('youtube-dl')) {
      return { ...task, title: task.title.replace('youtube-dl', downloaderName) };
    }
    return task;
  }

  updateExistingTasks(existingTasks: Task[], newTasks: Task[]): Task[] {
    return existingTasks.map(existingTask => {
      const updatedTask = newTasks.find(t => t.key === existingTask.key);
      return updatedTask || existingTask;
    });
  }

  tasksAreEqual(tasks1: Task[], tasks2: Task[]): boolean {
    return JSON.stringify(tasks1) === JSON.stringify(tasks2);
  }
}
