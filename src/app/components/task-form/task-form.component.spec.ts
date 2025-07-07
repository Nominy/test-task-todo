import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: any;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'not completed',
    createdAt: new Date()
  };

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTaskById', 'addTask', 'updateTask']);
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
      imports: [TaskFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
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



  it('should initialize form with default values', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.get('status')?.value).toBe('not completed');
  });

  it('should be in create mode when route id is "new"', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('new');
    
    component.ngOnInit();
    
    expect(component.isEditMode).toBe(false);
  });

  it('should be in edit mode when route id is not "new"', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('123');
    taskService.getTaskById.and.returnValue(of(mockTask));
    
    component.ngOnInit();
    
    expect(component.isEditMode).toBe(true);
    expect(taskService.getTaskById).toHaveBeenCalledWith('123');
  });

  it('should load task data in edit mode', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('123');
    taskService.getTaskById.and.returnValue(of(mockTask));
    
    component.ngOnInit();
    
    expect(component.taskForm.get('title')?.value).toBe(mockTask.title);
    expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
    expect(component.taskForm.get('status')?.value).toBe(mockTask.status);
  });

  it('should handle task not found in edit mode', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('123');
    taskService.getTaskById.and.returnValue(of(undefined));
    
    component.ngOnInit();
    
    expect(snackBar.open).toHaveBeenCalledWith('Task not found', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should validate required title field', () => {
    const titleControl = component.taskForm.get('title');
    
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    
    expect(titleControl?.hasError('required')).toBe(true);
    expect(component.getErrorMessage('title')).toBe('title is required');
  });

  it('should validate title length', () => {
    const titleControl = component.taskForm.get('title');
    
    titleControl?.setValue('a'.repeat(101));
    titleControl?.markAsTouched();
    
    expect(titleControl?.hasError('maxlength')).toBe(true);
  });

  it('should validate description length', () => {
    const descriptionControl = component.taskForm.get('description');
    
    descriptionControl?.setValue('a'.repeat(501));
    descriptionControl?.markAsTouched();
    
    expect(descriptionControl?.hasError('maxlength')).toBe(true);
  });

  it('should create new task when form is valid', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('new');
    component.ngOnInit();
    
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'New Description'
    });
    
    component.onSubmit();
    
    expect(taskService.addTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      status: 'not completed'
    });
    expect(snackBar.open).toHaveBeenCalledWith('Task created successfully', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should update existing task when form is valid', () => {
    activatedRoute.snapshot.paramMap.get.and.returnValue('123');
    taskService.getTaskById.and.returnValue(of(mockTask));
    component.ngOnInit();
    
    component.taskForm.patchValue({
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed'
    });
    
    component.onSubmit();
    
    expect(taskService.updateTask).toHaveBeenCalledWith('123', {
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed'
    });
    expect(snackBar.open).toHaveBeenCalledWith('Task updated successfully', 'Close', jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should not submit when form is invalid', () => {
    component.taskForm.patchValue({ title: '' });
    
    component.onSubmit();
    
    expect(taskService.addTask).not.toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should mark form as touched when invalid submission attempted', () => {
    component.taskForm.patchValue({ title: '' });
    spyOn(component.taskForm.get('title')!, 'markAsTouched');
    
    component.onSubmit();
    
    expect(component.taskForm.get('title')!.markAsTouched).toHaveBeenCalled();
  });
}); 