import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      status: 'not completed',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      status: 'completed',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getFilteredTasks', 'toggleTaskStatus', 'deleteTask']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    taskService.getFilteredTasks.and.returnValue(of(mockTasks));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default filter', () => {
    expect(component.filter.search).toBe('');
    expect(component.filter.status).toBe('all');
  });

  it('should load tasks on init', () => {
    fixture.detectChanges();
    
    expect(taskService.getFilteredTasks).toHaveBeenCalledWith(component.filter);
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should reload tasks when filter changes', () => {
    fixture.detectChanges();
    taskService.getFilteredTasks.calls.reset();
    
    component.onFilterChange();
    
    expect(taskService.getFilteredTasks).toHaveBeenCalledWith(component.filter);
  });

  it('should navigate to new task form', () => {
    component.onAddTask();
    
    expect(router.navigate).toHaveBeenCalledWith(['/tasks/new']);
  });

  it('should navigate to task details', () => {
    const taskId = 'test-id';
    
    component.onViewTask(taskId);
    
    expect(router.navigate).toHaveBeenCalledWith(['/tasks', taskId]);
  });

  it('should toggle task status', () => {
    const task = mockTasks[0];
    
    component.onToggleStatus(task);
    
    expect(taskService.toggleTaskStatus).toHaveBeenCalledWith(task.id);
  });

  it('should delete task after confirmation', () => {
    const task = mockTasks[0];
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.onDeleteTask(task);
    
    expect(taskService.deleteTask).toHaveBeenCalledWith(task.id);
  });

  it('should not delete task if not confirmed', () => {
    const task = mockTasks[0];
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.onDeleteTask(task);
    
    expect(taskService.deleteTask).not.toHaveBeenCalled();
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('completed')).toBe('primary');
    expect(component.getStatusColor('not completed')).toBe('accent');
  });

  it('should return correct status icon', () => {
    expect(component.getStatusIcon('completed')).toBe('check_circle');
    expect(component.getStatusIcon('not completed')).toBe('radio_button_unchecked');
  });

  it('should display empty state when no tasks', () => {
    taskService.getFilteredTasks.and.returnValue(of([]));
    fixture.detectChanges();
    
    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should display task cards when tasks exist', () => {
    fixture.detectChanges();
    
    const taskCards = fixture.nativeElement.querySelectorAll('.task-card');
    expect(taskCards.length).toBe(mockTasks.length);
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
}); 