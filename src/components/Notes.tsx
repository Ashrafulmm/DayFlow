import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Edit2, X, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types';
import { getNotes, saveNotes } from '../store';

const NOTE_COLORS = [
  '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#f3e8ff',
  '#fff7ed', '#ecfdf5', '#f0f9ff', '#fef2f2', '#f5f3ff'
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    color: NOTE_COLORS[0],
  });

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.title.trim() && !form.content.trim()) return;

    let updated: Note[];
    if (editingNote) {
      updated = notes.map(n =>
        n.id === editingNote.id
          ? { ...n, title: form.title, content: form.content, color: form.color, updatedAt: new Date().toISOString() }
          : n
      );
    } else {
      const newNote: Note = {
        id: uuidv4(),
        title: form.title,
        content: form.content,
        color: form.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updated = [newNote, ...notes];
    }

    setNotes(updated);
    saveNotes(updated);
    resetForm();
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, color: note.color });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setForm({ title: '', content: '', color: NOTE_COLORS[0] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
          <p className="text-gray-500 text-sm">{notes.length} notes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-400">
            {search ? 'No notes match your search' : 'No notes yet. Create your first note!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              style={{ backgroundColor: note.color }}
              onClick={() => editNote(note)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 truncate flex-1">{note.title || 'Untitled'}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => { e.stopPropagation(); editNote(note); }}
                    className="p-1 hover:bg-white/50 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="p-1 hover:bg-white/50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-4 whitespace-pre-wrap">
                {note.content || 'Empty note'}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                {format(new Date(note.updatedAt), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingNote ? 'Edit Note' : 'New Note'}
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
                  placeholder="Note title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  rows={8}
                  placeholder="Write your note here..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {NOTE_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        form.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110 border-gray-300' : 'border-gray-200'
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
                {editingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
