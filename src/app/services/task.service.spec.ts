import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task, TaskFilter } from '../models/task.model';
import { take } from 'rxjs/operators';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty tasks array', (done) => {
    service.getTasks().pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(0);
      done();
    });
  });

  it('should add a new task', (done) => {
    const newTask = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'not completed' as const
    };

    service.addTask(newTask);

    service.getTasks().pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      const addedTask = tasks.find(t => t.title === 'Test Task');
      expect(addedTask).toBeTruthy();
      expect(addedTask!.description).toBe('Test Description');
      expect(addedTask!.status).toBe('not completed');
      expect(addedTask!.id).toBeTruthy();
      expect(addedTask!.createdAt).toBeInstanceOf(Date);
      done();
    });
  });

  it('should update a task', (done) => {
    // First add a task to update
    const initialTask = {
      title: 'Initial Task',
      description: 'Initial Description',
      status: 'not completed' as const
    };
    service.addTask(initialTask);

    // Get the current tasks to find the ID
    service.getTasks().pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      const addedTask = tasks.find(t => t.title === 'Initial Task');
      expect(addedTask).toBeTruthy();
      
      // Update the task
      const updates = { title: 'Updated Title', status: 'completed' as const };
      service.updateTask(addedTask!.id, updates);

      // Verify the update
      service.getTasks().pipe(take(1)).subscribe(updatedTasks => {
        const updatedTask = updatedTasks.find(t => t.id === addedTask!.id);
        expect(updatedTask!.title).toBe('Updated Title');
        expect(updatedTask!.status).toBe('completed');
        done();
      });
    });
  });

  it('should delete a task', (done) => {
    // First add a task to delete
    const taskToAdd = {
      title: 'Task to Delete',
      description: 'Will be deleted',
      status: 'not completed' as const
    };
    service.addTask(taskToAdd);

    // Get the current tasks to find the ID
    service.getTasks().pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      const addedTask = tasks.find(t => t.title === 'Task to Delete');
      expect(addedTask).toBeTruthy();
      
      // Delete the task
      service.deleteTask(addedTask!.id);

      // Verify deletion
      service.getTasks().pipe(take(1)).subscribe(remainingTasks => {
        expect(remainingTasks.length).toBe(0);
        expect(remainingTasks.find(t => t.id === addedTask!.id)).toBeUndefined();
        done();
      });
    });
  });

  it('should toggle task status', (done) => {
    // First add a task to toggle
    const taskToAdd = {
      title: 'Task to Toggle',
      description: 'Status will be toggled',
      status: 'not completed' as const
    };
    service.addTask(taskToAdd);

    // Get the current tasks to find the ID
    service.getTasks().pipe(take(1)).subscribe(tasks => {
      const addedTask = tasks.find(t => t.title === 'Task to Toggle');
      expect(addedTask).toBeTruthy();
      
      // Toggle the status
      service.toggleTaskStatus(addedTask!.id);

      // Verify the toggle
      service.getTasks().pipe(take(1)).subscribe(updatedTasks => {
        const updatedTask = updatedTasks.find(t => t.id === addedTask!.id);
        expect(updatedTask!.status).toBe('completed');
        done();
      });
    });
  });

  it('should get task by id', (done) => {
    // First add a task to retrieve
    const taskToAdd = {
      title: 'Task to Retrieve',
      description: 'Will be retrieved by ID',
      status: 'not completed' as const
    };
    service.addTask(taskToAdd);

    // Get the current tasks to find the ID
    service.getTasks().pipe(take(1)).subscribe(tasks => {
      const addedTask = tasks.find(t => t.title === 'Task to Retrieve');
      expect(addedTask).toBeTruthy();
      
      // Test getTaskById
      service.getTaskById(addedTask!.id).pipe(take(1)).subscribe(task => {
        expect(task).toBeTruthy();
        expect(task!.id).toBe(addedTask!.id);
        expect(task!.title).toBe('Task to Retrieve');
        done();
      });
    });
  });

  it('should return undefined for non-existent task id', (done) => {
    service.getTaskById('non-existent-id').pipe(take(1)).subscribe(task => {
      expect(task).toBeUndefined();
      done();
    });
  });

  it('should filter tasks by status', (done) => {
    // Add sample tasks for filtering
    service.addTask({
      title: 'Completed Task',
      description: 'This is completed',
      status: 'completed' as const
    });
    service.addTask({
      title: 'Not Completed Task',
      description: 'This is not completed',
      status: 'not completed' as const
    });

    const filter: TaskFilter = { status: 'completed' };
    
    service.getFilteredTasks(filter).pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks.every(t => t.status === 'completed')).toBe(true);
      done();
    });
  });

  it('should filter tasks by search term', (done) => {
    // Add sample tasks for searching
    service.addTask({
      title: 'Complete Angular project',
      description: 'Build an Angular application',
      status: 'not completed' as const
    });
    service.addTask({
      title: 'Learn Angular routing',
      description: 'Study Angular routing concepts',
      status: 'not completed' as const
    });
    service.addTask({
      title: 'Write tests',
      description: 'Write unit tests for the app',
      status: 'completed' as const
    });

    const filter: TaskFilter = { search: 'Angular' };
    
    service.getFilteredTasks(filter).pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks.every(t => 
        t.title.toLowerCase().includes('angular') || 
        (t.description && t.description.toLowerCase().includes('angular'))
      )).toBe(true);
      done();
    });
  });

  it('should filter tasks by both status and search', (done) => {
    // Add sample tasks for combined filtering
    service.addTask({
      title: 'Test Angular component',
      description: 'Create test for Angular component',
      status: 'not completed' as const
    });
    service.addTask({
      title: 'Test React component',
      description: 'Create test for React component',
      status: 'not completed' as const
    });
    service.addTask({
      title: 'Test Angular service',
      description: 'Create test for Angular service',
      status: 'completed' as const
    });

    const filter: TaskFilter = { status: 'not completed', search: 'test' };
    
    service.getFilteredTasks(filter).pipe(take(1)).subscribe(tasks => {
      expect(tasks.every(t => t.status === 'not completed')).toBe(true);
      expect(tasks.every(t => 
        t.title.toLowerCase().includes('test') || 
        (t.description && t.description.toLowerCase().includes('test'))
      )).toBe(true);
      done();
    });
  });

  it('should return all tasks when filter is empty', (done) => {
    // Add sample tasks
    service.addTask({
      title: 'Task 1',
      description: 'First task',
      status: 'not completed' as const
    });
    service.addTask({
      title: 'Task 2',
      description: 'Second task',
      status: 'completed' as const
    });
    service.addTask({
      title: 'Task 3',
      description: 'Third task',
      status: 'not completed' as const
    });

    const filter: TaskFilter = { status: 'all' };
    
    service.getFilteredTasks(filter).pipe(take(1)).subscribe(tasks => {
      expect(tasks.length).toBe(3);
      done();
    });
  });

  it('should sort tasks by creation date (newest first)', (done) => {
    // Add tasks with slight delays to ensure different creation times
    service.addTask({
      title: 'First Task',
      description: 'Created first',
      status: 'not completed' as const
    });
    
    setTimeout(() => {
      service.addTask({
        title: 'Second Task',
        description: 'Created second',
        status: 'not completed' as const
      });
      
      setTimeout(() => {
        service.addTask({
          title: 'Third Task',
          description: 'Created third',
          status: 'not completed' as const
        });
        
        setTimeout(() => {
          const filter: TaskFilter = {};
          
          service.getFilteredTasks(filter).pipe(take(1)).subscribe(tasks => {
            for (let i = 0; i < tasks.length - 1; i++) {
              expect(new Date(tasks[i].createdAt).getTime()).toBeGreaterThanOrEqual(
                new Date(tasks[i + 1].createdAt).getTime()
              );
            }
            done();
          });
        }, 10);
      }, 10);
    }, 10);
  });
}); 