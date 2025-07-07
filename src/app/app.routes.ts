import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    title: 'Task List'
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    title: 'Create Task'
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    title: 'Task Details'
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    title: 'Edit Task'
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
