export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not completed' | 'completed';
  createdAt: Date;
}

export interface TaskFilter {
  search?: string;
  status?: 'all' | 'completed' | 'not completed';
} 