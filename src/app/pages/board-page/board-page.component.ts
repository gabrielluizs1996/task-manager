import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskModel } from 'src/app/services/task/task-model';
import { TaskService } from 'src/app/services/task/task.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit {
  tasks: TaskModel[] = [];
  done: TaskModel[] = [];
  taskForm = new FormGroup({
    titulo: new FormControl(''),
    descricao: new FormControl(''),
  });

  @ViewChild('tasksPaginator') tasksPaginator: MatPaginator | undefined;
  @ViewChild('donePaginator') donePaginator: MatPaginator | undefined;
  pagedTasks: TaskModel[] = [];
  pagedDone: TaskModel[] = [];

  pageSize = 6;
  pageIndex = 0;

  constructor(
    private taskService: TaskService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.getTask();
  }

  handleOpenDialog(content: any) {
    const confirmFn = async () => {
      if (this.taskForm.invalid) {
        this.taskForm.markAllAsTouched();
        return;
      }
      this.createTask();
    };
    this.dialogService.openDialog(content, confirmFn);
  }

  drop(event: CdkDragDrop<TaskModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
  
      if (event.container && event.container.id === 'doneList') {
        task.status = 'concluido';
        this.done.push(task);
        this.tasks = this.tasks.filter(item => item !== task);
      } else if (event.container && event.container.id === 'todoList') {
        task.status = 'pendente';
        this.tasks.push(task);
        this.done = this.done.filter(item => item !== task);
      }
  
      if (task) {
        this.taskService.putTasks(task).subscribe((res) => {
          console.log(res);
          this.updateTaskLists();
        });
      }
    }
  }  

  updateTaskLists() {
    this.pagedTasks = this.paginateArray(
      this.tasks.filter((task) => task.status === 'pendente'),
      this.tasksPaginator
    );
    this.pagedDone = this.paginateArray(this.done, this.donePaginator);
  }

  getTask() {
    this.taskService
      .getTasks()
      .pipe(
        tap((tasks) => {
          this.tasks = tasks.filter((task) => task.status === 'pendente');
          this.done = tasks.filter((task) => task.status === 'concluido');
          this.updateTaskLists();
        })
      )
      .subscribe();
  }

  paginateArray(array: TaskModel[], paginator?: MatPaginator): TaskModel[] {
    if (!paginator) {
      return array;
    }

    const startIndex = paginator.pageIndex * paginator.pageSize;
    const endIndex = startIndex + paginator.pageSize;
    return array.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent, array: TaskModel[]) {
    this.pageIndex = event.pageIndex;
    this.updateTaskLists();
  }

  deleteTask(task: TaskModel) {
    this.taskService.deleteTasks(task).subscribe(() => this.getTask());
    this.updateTaskLists();
  }

  createTask() {
    this.taskService
      .postTasks({
        ...this.taskForm.value,
        status: 'pendente',
      } as TaskModel)
      .subscribe(() => {
        this.getTask()
        this.taskForm.reset();
      });
  }

  separateTasks() {
    this.done = this.tasks.filter((task) => task.status === 'concluido');
    this.tasks = this.tasks.filter((task) => task.status === 'pendente');
  }
}
