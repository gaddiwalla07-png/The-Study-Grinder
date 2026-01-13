
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FileItem } from '../types';

export const VaultScreen: React.FC = () => {
  const [editingImage, setEditingImage] = useState<FileItem | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);

  const categories = [
    { title: 'UI Theories', icon: 'book_4', count: 12, color: 'text-sage' },
    { title: 'Botanical Arts', icon: 'eco', count: 8, color: 'text-nature-green' },
  ];

  const recentFiles: FileItem[] = [
    { id: '1', name: 'Semester_Goals.pdf', modified: '2 hours ago', type: 'pdf', color: 'text-nature-sage' } as any,
    { id: '2', name: 'Garden_Sketch.jpg', modified: 'Yesterday', type: 'image', color: 'text-nature-green', url: 'https://images.unsplash.com/photo-1581451334165-0509b2b8c9a2?q=80&w=800' } as any,
    { id: '3', name: 'Lecture_Bio_04.mp4', modified: '3 days ago', type: 'video', color: 'text-nature-moss' } as any,
  ];

  const handleEditImage = async () => {
    if (!prompt || !editingImage?.url) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `Apply this change to the image: ${prompt}` },
            { inlineData: { data: await fetch(editingImage.url).then(r => r.blob()).then(b => new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(b);
              })), mimeType: 'image/jpeg' } }
          ]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setEditedUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
      alert("The alchemy failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-6 animate-fadeIn pb-20">
      <header className="sticky top-0 z-40 glass-nav -mx-6 px-6 py-4 border-b border-white/20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-nature-moss text-2xl">database</span>
            <h1 className="text-lg font-semibold tracking-tight text-nature-moss">Knowledge Grove</h1>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
            <span className="material-symbols-outlined text-nature-moss/70">filter_list</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-8 space-y-8">
        <section>
          <h2 className="text-5xl font-serif text-nature-moss/90 leading-tight">
            The <br/><span className="italic font-normal text-nature-sage">Library</span>
          </h2>
          <div className="mt-8 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-nature-moss/40 text-xl">search</span>
            <input 
              className="w-full glass-card border-white/30 rounded-full py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-nature-sage/30 placeholder:text-nature-moss/40" 
              placeholder="Search your vault..." 
              type="text"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nature-sage">Study Materials</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.title} className="glass-card p-5 rounded-3xl group cursor-pointer hover:bg-white/50 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center mb-4 ${cat.color}`}>
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <h4 className="text-nature-moss font-medium text-sm">{cat.title}</h4>
                <p className="text-[10px] text-nature-moss/50 mt-1">{cat.count} resources</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nature-sage">Recent Files</h3>
          </div>
          {recentFiles.map((file) => (
            <div 
              key={file.id} 
              onClick={() => file.type === 'image' && setEditingImage(file)}
              className="glass-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined ${file.type === 'image' ? 'text-nature-green' : 'text-nature-sage'}`}>
                  {file.type === 'image' ? 'image' : file.type === 'pdf' ? 'description' : 'movie'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-nature-moss text-sm font-medium">{file.name}</h4>
                <p className="text-[10px] text-nature-moss/40">{file.type === 'image' ? 'Click to edit with Alchemist' : `Modified ${file.modified}`}</p>
              </div>
              <span className="material-symbols-outlined text-nature-moss/30 text-lg">more_vert</span>
            </div>
          ))}
        </section>
      </main>

      {/* Image Alchemist Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col p-6 animate-fadeIn">
          <header className="flex justify-between items-center mb-6">
            <h3 className="text-white font-serif italic text-xl">Image Alchemist</h3>
            <button onClick={() => { setEditingImage(null); setEditedUrl(null); }} className="text-white/60">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="w-full max-w-sm aspect-square bg-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/10">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white gap-3">
                  <div className="w-12 h-12 border-4 border-nature-sage border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Altering Reality...</p>
                </div>
              )}
              <img 
                src={editedUrl || editingImage.url} 
                className="w-full h-full object-contain" 
                alt="Alchemist Target" 
              />
            </div>

            <div className="w-full max-w-sm space-y-4">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-nature-sage/40"
                placeholder="e.g., 'Add a retro filter', 'Make it sunset'"
              />
              <button 
                onClick={handleEditImage}
                disabled={isProcessing || !prompt}
                className="w-full bg-nature-sage text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                Apply Alchemy
              </button>
              {editedUrl && (
                <button 
                  onClick={() => setEditedUrl(null)}
                  className="w-full text-white/40 text-[10px] uppercase font-bold tracking-widest"
                >
                  Reset to Original
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button className="fixed bottom-32 right-8 w-14 h-14 bg-nature-moss text-white rounded-full flex items-center justify-center shadow-lg shadow-nature-moss/20 active:scale-95 transition-all z-30">
        <span className="material-symbols-outlined text-2xl">upload_file</span>
      </button>
    </div>
  );
};
