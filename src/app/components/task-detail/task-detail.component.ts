import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  task: Task | null = null;
  isLoading = true;
  taskId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.loadTask(this.taskId);
    } else {
      this.showError('Invalid task ID');
      this.goBack();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTask(id: string): void {
    this.isLoading = true;
    this.taskService.getTaskById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          if (task) {
            this.task = task;
          } else {
            this.showError('Task not found');
            this.goBack();
          }
          this.isLoading = false;
        },
        error: () => {
          this.showError('Failed to load task');
          this.isLoading = false;
          this.goBack();
        }
      });
  }

  onEditTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  onToggleStatus(): void {
    if (this.task) {
      this.taskService.toggleTaskStatus(this.task.id);
      const newStatus = this.task.status === 'completed' ? 'not completed' : 'completed';
      this.showSuccess(`Task marked as ${newStatus}`);
    }
  }

  onDeleteTask(): void {
    if (this.task && confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskService.deleteTask(this.task.id);
      this.showSuccess('Task deleted successfully');
      this.goBack();
    }
  }

  onBack(): void {
    this.goBack();
  }

  private goBack(): void {
    this.router.navigate(['/tasks']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'primary' : 'accent';
  }

  getStatusIcon(status: string): string {
    return status === 'completed' ? 'check_circle' : 'radio_button_unchecked';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
} 