import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Edit2, X, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { getTasks, saveTasks } from '../store';

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];
const PRIORITIES = ['low', 'medium', 'high'] as const;

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'Work',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const handleSave = () => {
    if (!form.title.trim()) return;

    let updated: Task[];
    if (editingTask) {
      updated = tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, title: form.title, description: form.description, priority: form.priority, category: form.category, dueDate: form.dueDate }
          : t
      );
    } else {
      const newTask: Task = {
        id: uuidv4(),
        title: form.title,
        description: form.description,
        status: 'todo',
        priority: form.priority,
        category: form.category,
        dueDate: form.dueDate,
        createdAt: new Date().toISOString(),
      };
      updated = [...tasks, newTask];
    }

    setTasks(updated);
    saveTasks(updated);
    resetForm();
  };

  const updateStatus = (id: string, status: Task['status']) => {
    const updated = tasks.map(t =>
      t.id === id
        ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : undefined }
        : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || format(new Date(), 'yyyy-MM-dd'),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setForm({ title: '', description: '', priority: 'medium', category: 'Work', dueDate: format(new Date(), 'yyyy-MM-dd') });
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const statusIcons = {
    'todo': <Circle className="w-5 h-5 text-gray-400" />,
    'in-progress': <Clock className="w-5 h-5 text-yellow-500" />,
    'done': <CheckCircle2 className="w-5 h-5 text-green-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-500 text-sm">{tasks.length} total tasks • {tasks.filter(t => t.status === 'done').length} completed</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            {(['all', 'todo', 'in-progress', 'done'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                categoryFilter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  categoryFilter === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-400">No tasks found. Add your first task!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all ${
                task.status === 'done' ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status Toggle */}
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => updateStatus(task.id, 'todo')} title="To Do">
                    {task.status === 'todo' ? statusIcons.todo : <Circle className="w-4 h-4 text-gray-300" />}
                  </button>
                  <button onClick={() => updateStatus(task.id, 'in-progress')} title="In Progress">
                    {task.status === 'in-progress' ? statusIcons['in-progress'] : <Clock className="w-4 h-4 text-gray-300" />}
                  </button>
                  <button onClick={() => updateStatus(task.id, 'done')} title="Done">
                    {task.status === 'done' ? statusIcons.done : <CheckCircle2 className="w-4 h-4 text-gray-300" />}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {task.category}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">Due: {format(new Date(task.dueDate + 'T00:00:00'), 'MMM d, yyyy')}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => editTask(task)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-indigo-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Task details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
