
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppConfig, DEFAULT_CONFIG } from '../types';

export const AiOracleScreen: React.FC = () => {
  const [config] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('sanctuary_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  const [mode, setMode] = useState<'sage' | 'scout'>('sage');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = mode === 'sage' ? config.sageModel : config.scoutModel;
      const genConfig: any = {};
      
      if (mode === 'scout') {
        genConfig.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMessage,
        config: {
          ...genConfig,
          systemInstruction: mode === 'sage' 
            ? "You are the Sage of the Nature Sanctuary. You offer deep, poetic, and philosophical wisdom about productivity, life, and nature. Use a gentle and encouraging tone." 
            : "You are the Scout of the Nature Sanctuary. You provide factual, up-to-date information about biology, nature, and the world using Google Search. Always cite your findings."
        }
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "The forest is silent right now.",
        sources: sources
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "A storm has interrupted our connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="px-6 h-screen flex flex-col animate-fadeIn">
      <header className="pt-12 pb-6 flex flex-col items-center max-w-md mx-auto w-full gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-nature-green text-3xl">psychology</span>
          <h1 className="text-xl font-bold tracking-tight text-nature-moss/90 font-serif italic">The Intelligence Hub</h1>
        </div>
        
        <div className="flex bg-white/30 rounded-full p-1 w-full border border-white/40">
          <button 
            onClick={() => setMode('sage')}
            className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'sage' ? 'bg-nature-green text-white shadow-md' : 'text-nature-moss/60'}`}
          >
            The Sage
          </button>
          <button 
            onClick={() => setMode('scout')}
            className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'scout' ? 'bg-nature-green text-white shadow-md' : 'text-nature-moss/60'}`}
          >
            The Scout
          </button>
        </div>
        {config.advancedMode && (
          <p className="text-[9px] text-nature-green font-bold uppercase tracking-[0.2em] opacity-60">
            Active: {mode === 'sage' ? config.sageModel : config.scoutModel}
          </p>
        )}
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-w-md mx-auto w-full space-y-4 pb-4 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="text-center pt-20 px-8">
            <span className="material-symbols-outlined text-6xl text-nature-sage/40 mb-4">park</span>
            <p className="text-nature-moss/50 font-serif italic text-lg leading-relaxed">
              {mode === 'sage' 
                ? "Seek wisdom from the heart of the forest. What weighs on your mind today?" 
                : "Ask the scout to search the world for information. What shall we discover?"}
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm ${
              m.role === 'user' 
                ? 'bg-nature-moss text-white rounded-tr-none' 
                : 'glass-card text-nature-moss rounded-tl-none shadow-sm'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-nature-moss/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-nature-green mb-2">Sources Found</p>
                  <div className="flex flex-col gap-1">
                    {m.sources.map((chunk: any, j: number) => (
                      chunk.web && (
                        <a key={j} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-nature-green underline truncate block">
                          • {chunk.web.title || chunk.web.uri}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card px-5 py-3 rounded-3xl rounded-tl-none italic text-nature-moss/40 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-nature-sage rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-nature-sage rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-nature-sage rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </main>

      <div className="max-w-md mx-auto w-full pb-8 pt-4">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'sage' ? "Whisper to the sage..." : "Direct the scout..."}
            className="w-full glass-card rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-nature-green/20 placeholder:text-nature-moss/40"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-2 w-10 h-10 bg-nature-green text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-30 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
