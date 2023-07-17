import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from './task-model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://64b07065c60b8f941af5b6d1.mockapi.io/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl);
  }

  putTasks(task: TaskModel): Observable<any> {
    return this.http.put<TaskModel>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTasks(task: TaskModel): Observable<any> {
    return this.http.delete<TaskModel>(`${this.apiUrl}/${task.id}`);
  }

  postTasks(task: TaskModel) {
    return this.http.post<any>(this.apiUrl, task);
  }
}
