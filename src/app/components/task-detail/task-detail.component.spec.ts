import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: any;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'not completed',
    createdAt: new Date('2023-01-01T12:00:00Z')
  };

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTaskById', 'toggleTaskStatus', 'deleteTask']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    
    // Ensure the component uses the spy
    component['snackBar'] = snackBar;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.task).toBeNull();
  });

  it('should load task on init when valid id provided', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('1');
    taskService.getTaskById.and.returnValue(of(mockTask));

    component.ngOnInit();

    expect(taskService.getTaskById).toHaveBeenCalledWith('1');
    expect(component.task).toEqual(mockTask);
    expect(component.isLoading).toBe(false);
  });

  it('should handle task not found', async () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('1');
    taskService.getTaskById.and.returnValue(of(undefined));

    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(snackBar.open).toHaveBeenCalledWith('Task not found', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(component.isLoading).toBe(false);
  });

  it('should handle invalid task id', async () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue(null);

    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(snackBar.open).toHaveBeenCalledWith('Invalid task ID', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should handle load task error', async () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('1');
    taskService.getTaskById.and.returnValue(throwError(() => new Error('Load error')));

    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(snackBar.open).toHaveBeenCalledWith('Failed to load task', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to edit task', () => {
    component.task = mockTask;

    component.onEditTask();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks', mockTask.id, 'edit']);
  });

  it('should toggle task status', async () => {
    component.task = mockTask;

    component.onToggleStatus();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(taskService.toggleTaskStatus).toHaveBeenCalledWith(mockTask.id);
    expect(snackBar.open).toHaveBeenCalledWith('Task marked as completed', 'Close', jasmine.any(Object));
  });

  it('should delete task after confirmation', async () => {
    component.task = mockTask;
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDeleteTask();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTask.id);
    expect(snackBar.open).toHaveBeenCalledWith('Task deleted successfully', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should not delete task if not confirmed', () => {
    component.task = mockTask;
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDeleteTask();

    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('completed')).toBe('primary');
    expect(component.getStatusColor('not completed')).toBe('accent');
  });

  it('should return correct status icon', () => {
    expect(component.getStatusIcon('completed')).toBe('check_circle');
    expect(component.getStatusIcon('not completed')).toBe('radio_button_unchecked');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2023-01-01T12:00:00Z');
    const formatted = component.formatDate(testDate);
    
    expect(formatted).toContain('January');
    expect(formatted).toContain('2023');
  });

  it('should display loading state', () => {
    component.isLoading = true;
    component.task = null;
    fixture.detectChanges();

    const loadingState = fixture.nativeElement.querySelector('.loading-state');
    expect(loadingState).toBeTruthy();
  });

  it('should display task details when loaded', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('1');
    taskService.getTaskById.and.returnValue(of(mockTask));
    component.ngOnInit();
    fixture.detectChanges();

    const taskDetail = fixture.nativeElement.querySelector('.task-detail');
    expect(taskDetail).toBeTruthy();
    
    const title = fixture.nativeElement.querySelector('.task-title');
    expect(title.textContent.trim()).toBe(mockTask.title);
  });

  it('should display error state when task not found', () => {
    component.isLoading = false;
    component.task = null;
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
}); 