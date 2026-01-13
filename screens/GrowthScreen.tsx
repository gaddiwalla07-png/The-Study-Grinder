
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

export const GrowthScreen: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing your growth cycle...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate a short, poetic nature-themed productivity insight (max 15 words) for someone who has studied 84 hours this month in Botany and Ecology.',
          config: {
            systemInstruction: "You are a wise forest spirit guiding a student. Be brief, poetic, and encouraging.",
          }
        });
        setInsight(response.text || "Your focus grows like the ancient oak, steady and strong.");
      } catch (error) {
        console.error("AI Insight failed", error);
        setInsight("Nurture your focus, and your wisdom will blossom.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="px-6 animate-fadeIn pb-10">
      <header className="pt-12 pb-6 flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-lg font-bold tracking-tight text-nature-moss font-serif italic">Growth Insights</h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-white/50">
            <span className="material-symbols-outlined text-nature-sage text-xl">settings</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-nature-green shadow-md text-white">
            <span className="material-symbols-outlined">eco</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <section>
          <h2 className="text-4xl font-light font-serif leading-tight">
            Nurturing Your <br/><span className="text-nature-green font-bold italic">Natural Progress</span>
          </h2>
          <p className="mt-2 text-nature-moss/70 font-medium text-sm tracking-wide">Growing steadily • Spring Cycle</p>
        </section>

        <section className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm">
          <h3 className="w-full text-center text-xs font-bold text-nature-moss/60 mb-8 uppercase tracking-widest">Growth Cycle Progress</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="42" stroke="#E6EDE8" strokeWidth="8" />
              <circle 
                cx="50" cy="50" fill="transparent" r="42" 
                stroke="#A3B18A" strokeWidth="8" strokeDasharray="264" strokeDashoffset="42" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-serif font-bold italic text-nature-moss">84%</span>
              <span className="text-[10px] font-bold text-nature-moss/60 mt-1 uppercase tracking-tighter">84 of 100 hrs</span>
            </div>
          </div>
          <div className="mt-8 flex gap-3 items-center text-nature-green text-center">
            <span className="material-symbols-outlined text-lg">filter_vintage</span>
            <p className="text-sm font-medium italic italic font-serif">
              {loading ? 'Consulting the forest spirits...' : insight}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[2.5rem] p-6 flex flex-col justify-between aspect-square">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-400">wb_sunny</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-nature-moss/40">Streak</p>
              <p className="text-2xl font-serif font-bold text-nature-moss">12 Days</p>
            </div>
          </div>
          <div className="glass-card rounded-[2.5rem] p-6 flex flex-col justify-between aspect-square">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400">water_drop</span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-nature-moss/40">Roots</p>
              <p className="text-2xl font-serif font-bold text-nature-moss">128 Seeds</p>
            </div>
          </div>
        </div>

        <section className="glass-card rounded-[2.5rem] p-7 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-nature-moss/50 mb-6">Subject Flora</h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              { name: 'Botany', h: '20h' },
              { name: 'Ecology', h: '12h' },
              { name: 'Zoology', h: '8h' },
              { name: 'Climate', h: '2.5h' }
            ].map(sub => (
              <div key={sub.name} className="bg-white/40 border border-white/50 px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-xs font-bold text-nature-moss">{sub.name}</span>
                <span className="text-[9px] bg-nature-sage/20 text-nature-green px-2 py-0.5 rounded-full font-bold">{sub.h}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
