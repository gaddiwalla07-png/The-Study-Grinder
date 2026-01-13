
import React from 'react';
import { Task } from '../types';

export const FlowScreen: React.FC = () => {
  const tasks: Task[] = [
    { id: '1', title: 'UI Design Session', time: '09:00 AM — 11:00 AM', location: 'Studio Lab', type: 'session', completed: false },
    { id: '2', title: 'Review Figma Assets', priority: 'MINDFUL FOCUS', type: 'task', completed: true },
    { id: '3', title: 'Afternoon Respite', time: '11:30 AM — Afternoon', type: 'recharge', completed: false },
    { id: '4', title: 'History of Design', time: '02:00 PM', location: 'Online Sanctuary', type: 'session', completed: false },
  ];

  return (
    <div className="px-6 animate-fadeIn">
      <header className="pt-12 pb-6 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-nature-green text-3xl">spa</span>
          <h1 className="text-xl font-bold tracking-tight text-nature-moss/90 font-serif italic">Serene Flow</h1>
        </div>
        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-nature-moss">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <section className="mt-4">
          <h2 className="text-4xl font-light tracking-tight text-nature-moss leading-tight">
            Today's <span className="font-bold italic font-serif text-nature-green">Flow</span>
          </h2>
          <p className="text-nature-moss/60 text-sm mt-1">Nurture your focus and mind.</p>
        </section>

        <section className="relative pl-4 space-y-10">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] border-l border-dashed border-nature-green/30" />
          
          {tasks.map((task) => (
            <div key={task.id} className="flex gap-6 items-start relative">
              <div className={`z-10 p-1.5 rounded-full shadow-sm ring-4 ring-white/20 mt-2 ${
                task.completed ? 'bg-nature-green text-white' : 'bg-white text-nature-green'
              }`}>
                <span className="material-symbols-outlined text-lg leading-none">
                  {task.type === 'session' ? 'palette' : task.type === 'task' ? 'check_circle' : 'self_improvement'}
                </span>
              </div>
              
              <div className="flex-1">
                {task.type === 'recharge' ? (
                  <div className="bg-white/20 border border-white/30 rounded-3xl p-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <span className="text-nature-moss/70 text-xs italic">{task.time}</span>
                      <span className="text-[9px] bg-white text-nature-green px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Recharge</span>
                    </div>
                  </div>
                ) : (
                  <div className={`glass-card p-5 rounded-3xl shadow-sm ${task.completed ? 'bg-nature-green/5 border-nature-green/20' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-nature-green/70 tracking-widest uppercase">
                        {task.time || task.priority}
                      </span>
                      <span className="material-symbols-outlined text-nature-moss/40 text-sm">more_horiz</span>
                    </div>
                    <h3 className={`text-nature-moss text-lg font-semibold ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h3>
                    {task.location && (
                      <p className="text-nature-moss/60 text-xs font-medium mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span> {task.location}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      <button className="fixed bottom-32 right-8 w-14 h-14 bg-nature-green text-white rounded-full flex items-center justify-center shadow-lg shadow-nature-green/20 hover:scale-105 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-2xl font-light">add</span>
      </button>
    </div>
  );
};
