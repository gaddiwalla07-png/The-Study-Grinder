
import React, { useState, useEffect } from 'react';
import { Task, INITIAL_TASKS } from '../types';

export const FlowScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sanctuary_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '', type: 'task' as Task['type'] });

  useEffect(() => {
    localStorage.setItem('sanctuary_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      time: newTask.time || undefined,
      type: newTask.type,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: '', time: '', type: 'task' });
    setShowAddModal(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="px-6 animate-fadeIn min-h-screen">
      <header className="pt-12 pb-6 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-nature-green text-3xl">spa</span>
          <h1 className="text-xl font-bold tracking-tight text-nature-moss/90 font-serif italic">Serene Flow</h1>
        </div>
        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-nature-moss">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="max-w-md mx-auto space-y-8 pb-32">
        <section>
          <h2 className="text-4xl font-light tracking-tight text-nature-moss leading-tight">
            Today's <span className="font-bold italic font-serif text-nature-green">Flow</span>
          </h2>
          <p className="text-nature-moss/60 text-sm mt-1 italic">Managing your {tasks.length} active intentions.</p>
        </section>

        <section className="relative pl-4 space-y-8">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] border-l border-dashed border-nature-green/30" />
          
          {tasks.length === 0 && (
            <div className="text-center py-20 opacity-40 italic">
              The flow is currently empty. Add an intention to begin.
            </div>
          )}

          {tasks.map((task) => (
            <div key={task.id} className="flex gap-6 items-start relative group">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`z-10 p-1.5 rounded-full shadow-sm ring-4 ring-white/20 mt-2 transition-all active:scale-90 ${
                  task.completed ? 'bg-nature-green text-white' : 'bg-white text-nature-green hover:bg-nature-sage/10'
                }`}
              >
                <span className="material-symbols-outlined text-lg leading-none">
                  {task.completed ? 'check' : task.type === 'session' ? 'palette' : task.type === 'task' ? 'circle' : 'self_improvement'}
                </span>
              </button>
              
              <div className="flex-1">
                <div className={`glass-card p-5 rounded-3xl shadow-sm transition-all ${task.completed ? 'opacity-50 grayscale scale-[0.98]' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-nature-green/70 tracking-widest uppercase">
                      {task.time || 'DAILY INTENTION'}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="material-symbols-outlined text-nature-moss/20 text-sm hover:text-red-400 transition-colors"
                    >
                      delete
                    </button>
                  </div>
                  <h3 className={`text-nature-moss text-lg font-semibold leading-tight ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-32 right-8 w-14 h-14 bg-nature-green text-white rounded-full flex items-center justify-center shadow-lg shadow-nature-green/20 hover:scale-110 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-2xl font-light">add</span>
      </button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] bg-nature-moss/60 backdrop-blur-md flex items-end justify-center animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-[3rem] p-8 space-y-6 pb-12 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold italic text-nature-moss">New Intention</h3>
              <button onClick={() => setShowAddModal(false)} className="text-nature-moss/40 hover:text-nature-moss">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="What shall we accomplish?"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full bg-nature-moss/5 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-nature-green/20"
              />
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Time (e.g. 10:00 AM)"
                  value={newTask.time}
                  onChange={e => setNewTask({...newTask, time: e.target.value})}
                  className="flex-1 bg-nature-moss/5 border-none rounded-2xl p-4 text-xs"
                />
                <select 
                  value={newTask.type}
                  onChange={e => setNewTask({...newTask, type: e.target.value as any})}
                  className="bg-nature-moss/5 border-none rounded-2xl px-4 text-xs font-bold"
                >
                  <option value="task">Task</option>
                  <option value="session">Session</option>
                  <option value="recharge">Recharge</option>
                </select>
              </div>
              <button 
                onClick={addTask}
                className="w-full bg-nature-green text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Add to Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
