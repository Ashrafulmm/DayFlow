import { useState, useEffect, useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Task, ScheduleBlock } from '../types';
import { getTasks, getSchedule } from '../store';

type Period = 'daily' | 'weekly' | 'monthly';

export default function Progress() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [period, setPeriod] = useState<Period>('weekly');

  useEffect(() => {
    setTasks(getTasks());
    setSchedule(getSchedule());
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === 'daily') {
      startDate = now;
      endDate = now;
    } else if (period === 'weekly') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Daily breakdown
    const dailyData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.dueDate === dayStr);
      const completedTasks = dayTasks.filter(t => t.status === 'done').length;
      const daySchedule = schedule.filter(s => s.date === dayStr);
      const completedBlocks = daySchedule.filter(s => s.completed).length;

      return {
        date: format(day, period === 'monthly' ? 'd' : 'EEE'),
        fullDate: dayStr,
        tasks: dayTasks.length,
        completed: completedTasks,
        blocks: daySchedule.length,
        blocksDone: completedBlocks,
      };
    });

    // Totals
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;

    // Period totals
    const periodCompleted = dailyData.reduce((sum, d) => sum + d.completed, 0);
    const periodTotal = dailyData.reduce((sum, d) => sum + d.tasks, 0);
    const periodBlocksDone = dailyData.reduce((sum, d) => sum + d.blocksDone, 0);
    const periodBlocksTotal = dailyData.reduce((sum, d) => sum + d.blocks, 0);

    // Category breakdown
    const categoryData = tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Streak calculation
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const dayStr = format(subDays(now, i), 'yyyy-MM-dd');
      const dayCompleted = tasks.filter(t => t.completedAt && t.completedAt.startsWith(dayStr)).length;
      if (dayCompleted > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      dailyData,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      periodCompleted,
      periodTotal,
      periodBlocksDone,
      periodBlocksTotal,
      pieData,
      streak,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [tasks, schedule, period]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Progress Report</h1>
          <p className="text-gray-500 text-sm">Track your productivity over time</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Completion Rate</span>
          </div>
          <p className="text-3xl font-bold text-green-800">{stats.completionRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Tasks Done</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{stats.completedTasks}</p>
          <p className="text-xs text-blue-600">of {stats.totalTasks} total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Blocks Done</span>
          </div>
          <p className="text-3xl font-bold text-purple-800">{stats.periodBlocksDone}</p>
          <p className="text-xs text-purple-600">of {stats.periodBlocksTotal} scheduled</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-orange-800">{stats.streak}</p>
          <p className="text-xs text-orange-600">days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Task Completion</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="tasks" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Tasks by Category</h3>
          {stats.pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {stats.pieData.map((entry, i) => (
                  <span key={entry.name} className="flex items-center gap-1 text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No tasks to display
            </div>
          )}
        </div>
      </div>

      {/* Schedule Completion Line Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Schedule Adherence</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="blocksDone" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Blocks Done" />
              <Line type="monotone" dataKey="blocks" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#94a3b8' }} name="Blocks Planned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Task Status Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-600">{stats.todoTasks}</p>
            <p className="text-sm text-gray-500">To Do</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gray-400 rounded-full" style={{ width: `${stats.totalTasks > 0 ? (stats.todoTasks / stats.totalTasks) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgressTasks}</p>
            <p className="text-sm text-yellow-700">In Progress</p>
            <div className="mt-2 h-2 bg-yellow-100 rounded-full">
              <div className="h-2 bg-yellow-400 rounded-full" style={{ width: `${stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
            <p className="text-sm text-green-700">Completed</p>
            <div className="mt-2 h-2 bg-green-100 rounded-full">
              <div className="h-2 bg-green-400 rounded-full" style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
