import React from 'react';
import { Beer, RotateCw, MessageCircleQuestion, Zap, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';

interface MainMenuProps {
  onSelectMode: (mode: 'cards' | 'bottle' | 'truth' | 'dare') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  
  const handleClick = (mode: 'cards' | 'bottle' | 'truth' | 'dare') => {
    playSound('swoosh');
    onSelectMode(mode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
      
      <div className="text-center mb-10 space-y-2">
        <div className="inline-block p-3 bg-indigo-600 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] mb-4 rotate-3">
            <Beer className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
          赛博酒局 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">2077</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium tracking-wide">
          AI 驱动的终极派对助手
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Card 1: King's Cup */}
        <button 
          onClick={() => handleClick('cards')}
          className="group relative h-48 rounded-3xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center shadow-2xl hover:shadow-indigo-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-indigo-500/20 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
             <div className="text-4xl">🃏</div>
          </div>
          <h3 className="text-2xl font-bold text-white z-10">国王杯抽牌</h3>
          <p className="text-slate-400 text-sm mt-1 z-10">经典饮酒游戏</p>
        </button>

        {/* Card 2: Spin Bottle */}
        <button 
          onClick={() => handleClick('bottle')}
          className="group relative h-48 rounded-3xl bg-slate-800 border border-slate-700 hover:border-green-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center shadow-2xl hover:shadow-green-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-green-500/20 p-4 rounded-full mb-3 group-hover:rotate-180 transition-transform duration-500">
             <RotateCw className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white z-10">转瓶子</h3>
          <p className="text-slate-400 text-sm mt-1 z-10">决定谁来喝</p>
        </button>

        {/* Card 3: Truth */}
        <button 
          onClick={() => handleClick('truth')}
          className="group relative h-48 rounded-3xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center shadow-2xl hover:shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-2 right-3 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI + 本地
          </div>
          <div className="bg-blue-500/20 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
             <MessageCircleQuestion className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white z-10">真心话</h3>
          <p className="text-slate-400 text-sm mt-1 z-10">走心还是社死？</p>
        </button>

        {/* Card 4: Dare */}
        <button 
          onClick={() => handleClick('dare')}
          className="group relative h-48 rounded-3xl bg-slate-800 border border-slate-700 hover:border-fuchsia-500 transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center shadow-2xl hover:shadow-fuchsia-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-2 right-3 bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI + 本地
          </div>
          <div className="bg-fuchsia-500/20 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
             <Zap className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h3 className="text-2xl font-bold text-white z-10">大冒险</h3>
          <p className="text-slate-400 text-sm mt-1 z-10">胆小鬼勿入</p>
        </button>
      </div>

      <div className="mt-12 text-slate-600 text-sm">
        Design for Drunk People • Powered by Google Gemini
      </div>
    </div>
  );
};

export default MainMenu;