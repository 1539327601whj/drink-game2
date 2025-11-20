import React from 'react';
import { CardRule, RuleType, AIChallengeResponse, Card } from '../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/sound';

interface ActionModalProps {
  rule: CardRule | null;
  card: Card | null;
  aiChallenge: AIChallengeResponse | null;
  isLoadingAI: boolean;
  onNext: () => void;
  onRegenerateAI?: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ 
  rule, 
  card, 
  aiChallenge, 
  isLoadingAI, 
  onNext,
  onRegenerateAI
}) => {
  // Allow modal to render if there is either a rule OR we are loading AI
  if ((!rule && !isLoadingAI) && !card && !aiChallenge) return null;

  // Logic to handle "Manual Mode" where we don't have a card but have a rule
  const isAiType = rule?.type === RuleType.AI || isLoadingAI;
  
  // Determine styling based on rule type
  let bgGradient = "from-blue-600 to-blue-900";
  let icon = "🍺";
  let title = rule?.title || "Loading...";
  let description = rule?.description || "";

  if (isLoadingAI) {
    bgGradient = "from-slate-800 to-slate-950";
    icon = "🤖";
    title = "正在生成...";
  } else if (rule) {
    switch (rule.type) {
      case RuleType.ACTION:
        bgGradient = "from-red-600 to-red-900";
        icon = "🔥";
        break;
      case RuleType.GAME:
        bgGradient = "from-green-600 to-green-900";
        icon = "🎲";
        break;
      case RuleType.PASSIVE:
        bgGradient = "from-purple-600 to-purple-900";
        icon = "🔒";
        break;
      case RuleType.AI:
        bgGradient = "from-fuchsia-600 to-pink-900";
        icon = "⚡";
        break;
    }
  }

  // Override if AI content is ready
  if (aiChallenge && !isLoadingAI) {
    title = aiChallenge.title;
    description = aiChallenge.description;
    bgGradient = "from-fuchsia-600 to-pink-900";
    icon = "⚡";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md bg-gradient-to-br ${bgGradient} rounded-3xl p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300`}
      >
        <div className="bg-slate-900/95 rounded-[1.3rem] p-6 sm:p-8 text-center flex flex-col items-center min-h-[320px] justify-between relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Header */}
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-5xl mb-4 mx-auto ring-1 ring-white/20 shadow-lg animate-bounce-slow">
              {icon}
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-wide uppercase mb-2 font-marker drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {title}
            </h2>
            
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="flex-grow flex items-center justify-center w-full relative z-10">
            {isLoadingAI ? (
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-fuchsia-400" />
                    <div className="absolute inset-0 blur-lg bg-fuchsia-500/30 animate-pulse"></div>
                </div>
                <p className="text-fuchsia-200 animate-pulse font-medium tracking-widest text-sm">
                   AI 正在思考最损的招数...
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-300">
                <p className="text-xl sm:text-2xl text-white font-bold leading-relaxed drop-shadow-md">
                   {description}
                </p>
                {aiChallenge && (
                  <div className={`inline-flex items-center px-4 py-1 rounded-full bg-black/30 text-xs font-bold border border-white/10 uppercase tracking-widest ${
                      aiChallenge.intensity === 'High' ? 'text-red-400 border-red-900/50' : 
                      aiChallenge.intensity === 'Medium' ? 'text-yellow-400 border-yellow-900/50' : 
                      'text-green-400 border-green-900/50'
                  }`}>
                    强度: {aiChallenge.intensity}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="w-full mt-8 space-y-3 relative z-10">
             {isAiType && !isLoadingAI && onRegenerateAI && (
                <button 
                  onClick={() => {
                    playSound('click');
                    onRegenerateAI();
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold flex items-center justify-center space-x-2 transition-all border border-white/5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>换一个 (Switch)</span>
                </button>
             )}

            <button 
              onClick={() => {
                playSound('pop');
                onNext();
              }}
              className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-white to-slate-200 text-slate-900 font-black text-xl uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] border-b-4 border-slate-300"
            >
              完成 (Done)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;