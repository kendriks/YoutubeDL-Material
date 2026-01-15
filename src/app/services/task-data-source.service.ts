import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Task } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class TaskDataSourceService {

  createDataSource(tasks: Task[]): MatTableDataSource<Task> {
    return new MatTableDataSource<Task>(tasks);
  }

  updateDataSource(
    dataSource: MatTableDataSource<Task>,
    tasks: Task[],
    paginator?: MatPaginator,
    sort?: MatSort
  ): MatTableDataSource<Task> {
    dataSource.data = tasks;
    if (paginator) {
      dataSource.paginator = paginator;
    }
    if (sort) {
      dataSource.sort = sort;
    }
    return dataSource;
  }

  initializeDataSource(
    tasks: Task[],
    paginator: MatPaginator,
    sort: MatSort
  ): MatTableDataSource<Task> {
    const dataSource = new MatTableDataSource<Task>(tasks);
    dataSource.paginator = paginator;
    dataSource.sort = sort;
    return dataSource;
  }
}
