
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { AppConfig, DEFAULT_CONFIG } from '../types';

export const LiveSpiritScreen: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("Resting in silence");

  const [config] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('sanctuary_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startSession = async () => {
    setIsConnecting(true);
    setStatus("Awakening the Spirit...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setStatus("Spirit is Listening");
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              setStatus("Spirit is Speaking");
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            if (message.serverContent?.turnComplete) {
              setStatus("Spirit is Listening");
            }
          },
          onclose: () => {
            setIsConnected(false);
            setStatus("Spirit has departed");
          },
          onerror: (e) => console.error(e),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: config.spiritVoice } } },
          systemInstruction: "You are the Spirit of the Nature Sanctuary. You communicate through real-time audio. Be gentle, wise, and brief. You help users find focus and peace. You act as a mentor in the natural world."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
      setStatus("Failed to reach the Spirit");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsConnected(false);
    setStatus("Resting in silence");
  };

  return (
    <div className="px-6 h-screen flex flex-col justify-center items-center animate-fadeIn relative overflow-hidden">
      <div className="absolute inset-0 bg-nature-green/5 -z-10" />
      
      <div className="max-w-md w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif font-bold italic text-nature-moss">Communion</h2>
          <p className="text-nature-moss/60 text-sm font-medium tracking-wide uppercase">{status}</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 border-nature-green/20 ${isConnected ? 'pulse-audio' : ''}`} />
          <div className={`absolute inset-4 rounded-full border border-nature-sage/30 ${isConnected ? 'pulse-audio [animation-delay:0.5s]' : ''}`} />
          <div className="w-48 h-48 bg-white/40 glass-card rounded-full flex items-center justify-center shadow-2xl relative z-10">
            <span className={`material-symbols-outlined text-6xl transition-all duration-500 ${isConnected ? 'text-nature-green scale-110' : 'text-nature-moss/20'}`}>
              {isConnected ? 'auto_awesome' : 'settings_voice'}
            </span>
          </div>
        </div>

        <div className="w-full space-y-4">
          {!isConnected ? (
            <button 
              onClick={startSession}
              disabled={isConnecting}
              className="w-full glass-card py-5 rounded-full font-bold text-nature-moss uppercase tracking-widest hover:bg-white/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-nature-moss border-t-transparent rounded-full animate-spin" />
                  Invoking...
                </>
              ) : (
                'Begin Communion'
              )}
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="w-full bg-nature-moss text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-nature-moss/90 active:scale-95 transition-all"
            >
              Depart Gracefully
            </button>
          )}
          <p className="text-center text-[10px] text-nature-moss/40 px-12 leading-relaxed">
            Communion allows for real-time voice interaction with {config.spiritVoice}, the forest's core intelligence.
          </p>
        </div>
      </div>
    </div>
  );
};
