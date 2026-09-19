import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Zap, Calendar } from 'lucide-react';
import { Task, ScheduleBlock } from '../types';
import { getTasks, getSchedule } from '../store';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setSchedule(getSchedule());
  }, []);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaySchedule = schedule.filter(s => s.date === todayStr);
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate === todayStr;
  });

  const completedToday = todayTasks.filter(t => t.status === 'done').length;
  const completedBlocks = todaySchedule.filter(s => s.completed).length;
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 5);
  const upcomingBlocks = todaySchedule
    .filter(s => !s.completed)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 4);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{greeting()}! 👋</h1>
        <p className="text-indigo-100 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-sm text-indigo-100">Overall Progress</p>
            <p className="text-2xl font-bold">{overallProgress}%</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ListTodo className="w-5 h-5 text-blue-500" />}
          label="Total Tasks"
          value={totalTasks}
          bg="bg-blue-50"
          onClick={() => onNavigate('tasks')}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
          label="Completed"
          value={doneTasks}
          bg="bg-green-50"
          onClick={() => onNavigate('progress')}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-orange-500" />}
          label="Today's Blocks"
          value={`${completedBlocks}/${todaySchedule.length}`}
          bg="bg-orange-50"
          onClick={() => onNavigate('schedule')}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
          label="Today's Tasks"
          value={`${completedToday}/${todayTasks.length}`}
          bg="bg-purple-50"
          onClick={() => onNavigate('tasks')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Upcoming Today
            </h2>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </button>
          </div>
          {upcomingBlocks.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No upcoming blocks today</p>
          ) : (
            <div className="space-y-3">
              {upcomingBlocks.map(block => (
                <div key={block.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="w-2 h-10 rounded-full" style={{ backgroundColor: block.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{block.title}</p>
                    <p className="text-xs text-gray-500">{block.startTime} - {block.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              High Priority
            </h2>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </button>
          </div>
          {highPriorityTasks.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No high priority tasks pending</p>
          ) : (
            <div className="space-y-3">
              {highPriorityTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, onClick }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${bg} rounded-2xl p-4 text-left hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </button>
  );
}
