import { Task, ScheduleBlock, Note } from './types';

const KEYS = {
  tasks: 'dayflow_tasks',
  schedule: 'dayflow_schedule',
  notes: 'dayflow_notes',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Tasks
export function getTasks(): Task[] {
  return getItem<Task[]>(KEYS.tasks, []);
}

export function saveTasks(tasks: Task[]): void {
  setItem(KEYS.tasks, tasks);
}

// Schedule
export function getSchedule(): ScheduleBlock[] {
  return getItem<ScheduleBlock[]>(KEYS.schedule, []);
}

export function saveSchedule(schedule: ScheduleBlock[]): void {
  setItem(KEYS.schedule, schedule);
}

// Notes
export function getNotes(): Note[] {
  return getItem<Note[]>(KEYS.notes, []);
}

export function saveNotes(notes: Note[]): void {
  setItem(KEYS.notes, notes);
}
