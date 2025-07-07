import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, TaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    const sampleTasks: Task[] = [

    ];
    this.tasksSubject.next(sampleTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getFilteredTasks(filter: TaskFilter): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => {
        let filteredTasks = [...tasks];

        if (filter.status && filter.status !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.status === filter.status);
        }

        if (filter.search && filter.search.trim()) {
          const searchTerm = filter.search.toLowerCase().trim();
          filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm))
          );
        }

        return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      })
    );
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date()
    };

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(task => task.id === id);

    if (taskIndex !== -1) {
      const updatedTasks = [...currentTasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updates };
      this.tasksSubject.next(updatedTasks);
    }
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(filteredTasks);
  }

  toggleTaskStatus(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find(t => t.id === id);
    
    if (task) {
      const newStatus = task.status === 'completed' ? 'not completed' : 'completed';
      this.updateTask(id, { status: newStatus });
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 