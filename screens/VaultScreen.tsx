
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FileItem, INITIAL_FILES } from '../types';

export const VaultScreen: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('sanctuary_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  const [editingImage, setEditingImage] = useState<FileItem | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('sanctuary_files', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const type: FileItem['type'] = file.type.startsWith('image') ? 'image' : 
                                     file.type.includes('pdf') ? 'pdf' : 
                                     file.type.startsWith('video') ? 'video' : 'folder';
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        modified: 'Just now',
        type: type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: type === 'image' ? (reader.result as string) : undefined,
      };
      setFiles([newFile, ...files]);
    };
    reader.readAsDataURL(file);
  };

  const deleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(files.filter(f => f.id !== id));
  };

  const handleEditImage = async () => {
    if (!prompt || !editingImage?.url) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = editingImage.url.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `Edit this image as follows: ${prompt}` },
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
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
      alert("AI Image Alchemist failed. Ensure your API key is valid for nano banana models.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-6 animate-fadeIn pb-32">
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
              placeholder="Search study materials..." 
              type="text"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nature-sage">Your Categories</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-3xl group cursor-pointer hover:bg-white/50 transition-all border-dashed border-2 border-nature-moss/10 flex flex-col items-center justify-center text-nature-moss/40">
              <span className="material-symbols-outlined text-3xl mb-1">add_circle</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">New Topic</span>
            </div>
            <div className="glass-card p-5 rounded-3xl group cursor-pointer hover:bg-white/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-nature-green/10 flex items-center justify-center mb-4 text-nature-green">
                <span className="material-symbols-outlined text-2xl">eco</span>
              </div>
              <h4 className="text-nature-moss font-medium text-sm">Botany Arts</h4>
              <p className="text-[10px] text-nature-moss/50 mt-1">{files.length} resources</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-nature-sage">Library Inventory</h3>
          </div>
          {files.map((file) => (
            <div 
              key={file.id} 
              onClick={() => file.type === 'image' && setEditingImage(file)}
              className="glass-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/50 transition-all relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shrink-0 overflow-hidden">
                {file.url ? (
                  <img src={file.url} className="w-full h-full object-cover" />
                ) : (
                  <span className={`material-symbols-outlined ${file.type === 'image' ? 'text-nature-green' : 'text-nature-sage'}`}>
                    {file.type === 'image' ? 'image' : file.type === 'pdf' ? 'description' : 'movie'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-nature-moss text-sm font-semibold truncate">{file.name}</h4>
                <p className="text-[9px] font-bold uppercase tracking-widest text-nature-moss/40 mt-1">{file.size} • {file.modified}</p>
              </div>
              <button 
                onClick={(e) => deleteFile(file.id, e)}
                className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-red-400 p-2 hover:bg-red-50 rounded-full transition-all"
              >
                delete
              </button>
            </div>
          ))}
          {files.length === 0 && (
            <div className="text-center py-10 italic text-nature-moss/40 text-sm">Your vault is empty.</div>
          )}
        </section>
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
        accept="image/*,.pdf,video/*"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-32 right-8 w-14 h-14 bg-nature-moss text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-30"
      >
        <span className="material-symbols-outlined text-2xl">upload_file</span>
      </button>

      {/* Image Alchemist Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex flex-col p-6 animate-fadeIn">
          <header className="flex justify-between items-center mb-6">
            <h3 className="text-white font-serif italic text-2xl">Image Alchemist</h3>
            <button onClick={() => { setEditingImage(null); setEditedUrl(null); setPrompt(''); }} className="text-white/60 w-10 h-10 flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="w-full max-w-sm aspect-square bg-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-white gap-3">
                  <div className="w-10 h-10 border-4 border-nature-sage border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Refining Essence...</p>
                </div>
              )}
              <img 
                src={editedUrl || editingImage.url} 
                className="w-full h-full object-contain" 
                alt="Target" 
              />
            </div>

            <div className="w-full max-w-sm space-y-4">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-[1.5rem] p-5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-nature-sage/40"
                placeholder="How shall we transform this?"
              />
              <button 
                onClick={handleEditImage}
                disabled={isProcessing || !prompt}
                className="w-full bg-nature-sage text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-nature-sage/20"
              >
                Cast Spell
              </button>
              {editedUrl && (
                <button 
                  onClick={() => setEditedUrl(null)}
                  className="w-full text-white/40 text-[10px] uppercase font-bold tracking-widest p-2"
                >
                  Return to Origin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
