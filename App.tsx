import React, { useState, useEffect, useCallback } from 'react';
import { createDeck, RULES } from './constants';
import { Card, CardRule, RuleType, AIChallengeResponse, Suit, CardValue } from './types';
import { generatePartyChallenge } from './services/geminiService';
import CardDisplay from './components/CardDisplay';
import ActionModal from './components/ActionModal';
import MainMenu from './components/MainMenu';
import { RefreshCcw, Beer, ArrowLeft, Volume2 } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { playSound } from './utils/sound';

type AppMode = 'menu' | 'cards' | 'bottle' | 'truth' | 'dare';

function App() {
  // App Mode State
  const [appMode, setAppMode] = useState<AppMode>('menu');

  // Card Game State
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [kingsCount, setKingsCount] = useState(0);
  
  // AI/Modal State
  const [showModal, setShowModal] = useState(false);
  const [aiChallenge, setAiChallenge] = useState<AIChallengeResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  // This stores the "Rule" for manual modes (Truth/Dare) where there is no card
  const [manualRule, setManualRule] = useState<CardRule | null>(null);

  // Bottle State
  const [bottleAngle, setBottleAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Initialize Game on Load
  useEffect(() => {
    setDeck(createDeck());
  }, []);

  // Trigger Confetti
  const fireConfetti = () => {
    playSound('high-pitched');
    canvasConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#d946ef', '#10b981']
    });
  };

  // Reset for Card Game
  const resetCardGame = () => {
    playSound('swoosh');
    setDeck(createDeck());
    setDrawnCards([]);
    setCurrentCard(null);
    setIsFlipped(false);
    setKingsCount(0);
    setAiChallenge(null);
    setShowModal(false);
  };

  const returnToMenu = () => {
    playSound('click');
    setAppMode('menu');
    setShowModal(false);
    setManualRule(null);
    setAiChallenge(null);
  };

  // --- Logic: Draw Card ---
  const handleDrawCard = useCallback(async () => {
    if (deck.length === 0 || isFlipped) return;

    playSound('deal');
    
    // 1. Draw logic
    const newDeck = [...deck];
    const card = newDeck.pop();
    
    if (!card) return;

    setDeck(newDeck);
    setCurrentCard(card);
    setDrawnCards(prev => [...prev, card]);
    
    // 2. Animation Trigger
    setIsFlipped(true);

    // 3. Determine Rule
    if (card.value === CardValue.KING) {
      setKingsCount(prev => {
        const newCount = prev + 1;
        if (newCount === 4) fireConfetti(); // 4th King!
        return newCount;
      });
    }

    // 4. Prepare Modal (Delay for animation)
    setTimeout(async () => {
      setShowModal(true);
      // Handle AI Card (Joker)
      if (card.suit === Suit.JOKER) {
        await triggerAI('general');
      }
    }, 600);
  }, [deck, isFlipped]);


  // --- Logic: Trigger AI/Content ---
  const triggerAI = async (mode: 'general' | 'truth' | 'dare' = 'general') => {
    setIsLoadingAI(true);
    setAiChallenge(null);
    
    const challenge = await generatePartyChallenge(mode);
    
    setAiChallenge(challenge);
    setIsLoadingAI(false);
    playSound('pop');
  };

  // --- Logic: Manual Truth/Dare Mode Entry ---
  const startTruthOrDare = async (type: 'truth' | 'dare') => {
     setManualRule({
       title: type === 'truth' ? "真心话" : "大冒险",
       description: "...", // Placeholder
       type: RuleType.AI
     });
     setShowModal(true);
     await triggerAI(type);
  };

  // --- Logic: Bottle Spin ---
  const spinTheBottle = () => {
    if (isSpinning) return;
    playSound('click');
    setIsSpinning(true);
    // Random angle: at least 3 full spins (1080) + random
    const randomSpin = 1080 + Math.random() * 1440; 
    setBottleAngle(prev => prev + randomSpin);
    
    setTimeout(() => {
      setIsSpinning(false);
      fireConfetti();
    }, 3500); // Duration matches CSS transition
  };

  // Handle Modal Close/Next
  const handleModalNext = () => {
    setShowModal(false);
    
    if (appMode === 'cards') {
       setIsFlipped(false);
       setAiChallenge(null);
    } else {
       // If in Truth/Dare mode, we probably want to just close the modal 
       // and let them click the button again, OR automatically go to next?
       // Let's close it to let them breathe.
       setAiChallenge(null);
       setManualRule(null);
       
       // Optional: If you want to loop, uncomment below:
       // startTruthOrDare(appMode === 'truth' ? 'truth' : 'dare');
    }
  };

  const currentRule: CardRule | null = currentCard ? RULES[currentCard.value] : manualRule;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden flex flex-col font-sans selection:bg-fuchsia-500/30">
      
      {/* Background Ambient Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full p-4 flex justify-between items-center z-20 relative">
        <div className="flex items-center space-x-3">
           {appMode !== 'menu' && (
             <button 
               onClick={returnToMenu}
               className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 transition-all border border-white/10"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
           )}
           {appMode === 'menu' && (
             <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-2 rounded-xl shadow-lg">
                <Beer className="w-5 h-5 text-white" />
             </div>
           )}
        </div>
        
        <div className="flex items-center space-x-3">
           {appMode === 'cards' && (
             <div className="flex items-center space-x-1 text-sm font-bold text-slate-300 bg-slate-800/80 py-1.5 px-4 rounded-full border border-slate-700/50 shadow-sm backdrop-blur-sm">
                <span className="text-xs uppercase tracking-wider text-slate-500 mr-1">King's Cup</span>
                <span className={`${kingsCount >= 4 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{kingsCount}/4</span>
             </div>
           )}
           
           {appMode === 'cards' && (
             <button 
              onClick={resetCardGame}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="重洗"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
           )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow relative flex flex-col items-center justify-center p-4 z-10">
        
        {/* MODE: MAIN MENU */}
        {appMode === 'menu' && (
          <MainMenu onSelectMode={(mode) => {
             setAppMode(mode);
             if (mode === 'cards') resetCardGame();
             if (mode === 'truth') startTruthOrDare('truth');
             if (mode === 'dare') startTruthOrDare('dare');
          }} />
        )}

        {/* MODE: CARDS */}
        {appMode === 'cards' && (
          <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
               <CardDisplay 
                 card={currentCard || deck[deck.length - 1] || null} 
                 isFlipped={isFlipped} 
                 onClick={handleDrawCard}
               />
            </div>
            
            {!isFlipped && deck.length > 0 && (
              <div className="animate-bounce text-slate-400 text-sm font-bold tracking-widest uppercase bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur">
                点击卡牌抽签
              </div>
            )}

            {deck.length === 0 && (
               <div className="text-center">
                 <h2 className="text-3xl font-bold text-white mb-4">牌堆已空</h2>
                 <button onClick={resetCardGame} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold">
                   重新洗牌
                 </button>
               </div>
            )}
          </div>
        )}

        {/* MODE: BOTTLE */}
        {appMode === 'bottle' && (
           <div className="flex flex-col items-center justify-center h-full w-full animate-in fade-in duration-500">
              <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
                 {/* Bottle */}
                 <div 
                   className="w-24 h-[320px] bg-gradient-to-b from-green-400/90 via-green-600/90 to-green-800/90 rounded-full border-4 border-white/20 flex items-center justify-center shadow-[0_0_80px_rgba(74,222,128,0.2)] origin-center relative z-10"
                   style={{ 
                     transform: `rotate(${bottleAngle}deg)`,
                     transition: 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                     filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))'
                   }}
                 >
                    <div className="absolute top-4 w-full h-full bg-white/10 rounded-full skew-x-12 blur-sm"></div>
                    <div className="w-full text-center text-white/60 font-black text-2xl rotate-90 whitespace-nowrap tracking-widest">DRINK</div>
                    
                    {/* Bottle Neck/Cap */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-16 bg-green-500 rounded-t-lg border-x-4 border-green-700"></div>
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-300 rounded-sm"></div>
                 </div>
                 
                 {/* Center Pivot */}
                 <div className="absolute w-6 h-6 bg-slate-200 rounded-full shadow-inner z-20 border-2 border-slate-400"></div>
                 
                 {/* Floor Decoration */}
                 <div className="absolute inset-0 border-[10px] border-dashed border-slate-800/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
              </div>

              <button 
                onClick={spinTheBottle}
                disabled={isSpinning}
                className="mt-24 px-12 py-5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-[0_10px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[10px] text-2xl transition-all uppercase tracking-widest"
              >
                {isSpinning ? '...' : 'SPIN'}
              </button>
           </div>
        )}

        {/* MODE: TRUTH / DARE (Trigger Buttons) */}
        {(appMode === 'truth' || appMode === 'dare') && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95">
             <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-[0_0_60px_rgba(0,0,0,0.5)] ${appMode === 'truth' ? 'bg-blue-600 text-blue-100 shadow-blue-500/30' : 'bg-fuchsia-600 text-fuchsia-100 shadow-fuchsia-500/30'}`}>
                {appMode === 'truth' ? '?' : '⚡'}
             </div>
             
             <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-white uppercase tracking-wider">
                 {appMode === 'truth' ? '真心话' : '大冒险'}
               </h2>
               <p className="text-slate-400">点击下方按钮生成新的挑战</p>
             </div>

             <button 
               onClick={() => {
                 playSound('click');
                 startTruthOrDare(appMode);
               }}
               className="px-10 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg flex items-center gap-2"
             >
                <RefreshCcw className="w-5 h-5" />
                <span>下一题</span>
             </button>
          </div>
        )}

      </main>

      {/* Modals */}
      {showModal && (
        <ActionModal 
          rule={currentRule}
          card={currentCard}
          aiChallenge={aiChallenge}
          isLoadingAI={isLoadingAI}
          onNext={handleModalNext}
          onRegenerateAI={() => {
            // Re-trigger current context
            if (appMode === 'cards' && currentCard?.suit === Suit.JOKER) triggerAI('general');
            else if (appMode === 'truth') triggerAI('truth');
            else if (appMode === 'dare') triggerAI('dare');
            else triggerAI('general');
          }}
        />
      )}
    </div>
  );
}

export default App;