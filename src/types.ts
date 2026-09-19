export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  category: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  completed: boolean;
  date: string;
  taskId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface DailyProgress {
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  scheduleBlocksCompleted: number;
  scheduleBlocksTotal: number;
}

export type ViewType = 'dashboard' | 'schedule' | 'tasks' | 'progress' | 'notes';
