import { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Trash2, Check, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleBlock } from '../types';
import { getSchedule, saveSchedule } from '../store';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
];

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);
  const [form, setForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    color: COLORS[0],
  });

  useEffect(() => {
    setSchedule(getSchedule());
  }, []);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayBlocks = schedule
    .filter(s => s.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

  const handleSave = () => {
    if (!form.title.trim()) return;

    let updated: ScheduleBlock[];
    if (editingBlock) {
      updated = schedule.map(s =>
        s.id === editingBlock.id
          ? { ...s, title: form.title, startTime: form.startTime, endTime: form.endTime, color: form.color }
          : s
      );
    } else {
      const newBlock: ScheduleBlock = {
        id: uuidv4(),
        title: form.title,
        startTime: form.startTime,
        endTime: form.endTime,
        color: form.color,
        completed: false,
        date: dateStr,
      };
      updated = [...schedule, newBlock];
    }

    setSchedule(updated);
    saveSchedule(updated);
    resetForm();
  };

  const toggleComplete = (id: string) => {
    const updated = schedule.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    setSchedule(updated);
    saveSchedule(updated);
  };

  const deleteBlock = (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    setSchedule(updated);
    saveSchedule(updated);
  };

  const editBlock = (block: ScheduleBlock) => {
    setEditingBlock(block);
    setForm({
      title: block.title,
      startTime: block.startTime,
      endTime: block.endTime,
      color: block.color,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBlock(null);
    setForm({ title: '', startTime: '09:00', endTime: '10:00', color: COLORS[0] });
  };

  const completedCount = dayBlocks.filter(b => b.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daily Schedule</h1>
          <p className="text-gray-500 text-sm">Plan your day with time blocks</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>

      {/* Date Navigator */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-gray-800">{format(selectedDate, 'EEEE')}</p>
            <p className="text-sm text-gray-500">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: dayBlocks.length > 0 ? `${(completedCount / dayBlocks.length) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-gray-500 whitespace-nowrap">{completedCount}/{dayBlocks.length} done</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          {hours.map(hour => {
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const blocksAtHour = dayBlocks.filter(b => {
              const startH = parseInt(b.startTime.split(':')[0]);
              return startH === hour;
            });

            return (
              <div key={hour} className="flex gap-3 min-h-[50px]">
                <div className="w-14 text-right text-xs text-gray-400 pt-1 flex-shrink-0">
                  {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                </div>
                <div className="flex-1 border-t border-gray-100 relative">
                  {blocksAtHour.map(block => (
                    <div
                      key={block.id}
                      className={`absolute left-0 right-0 rounded-xl p-3 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                        block.completed ? 'opacity-60' : ''
                      }`}
                      style={{
                        backgroundColor: `${block.color}15`,
                        borderLeftColor: block.color,
                        top: '4px',
                        minHeight: '44px',
                      }}
                      onClick={() => editBlock(block)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium text-sm ${block.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {block.title}
                          </p>
                          <p className="text-xs text-gray-500">{block.startTime} - {block.endTime}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleComplete(block.id); }}
                            className={`p-1 rounded-lg transition ${
                              block.completed ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                            className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingBlock ? 'Edit Block' : 'New Time Block'}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="What will you do?"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        form.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
              >
                {editingBlock ? 'Update Block' : 'Add Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
