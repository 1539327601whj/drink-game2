import React from 'react';
import { Card, Suit, CardValue } from '../types';
import { Heart, Diamond, Club, Spade, Bot } from 'lucide-react';

interface CardDisplayProps {
  card: Card | null;
  isFlipped: boolean;
  onClick?: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, isFlipped, onClick }) => {
  // Render logic for suit icons
  const renderSuit = (suit: Suit, className: string) => {
    switch (suit) {
      case Suit.HEARTS: return <Heart className={className} fill="currentColor" />;
      case Suit.DIAMONDS: return <Diamond className={className} fill="currentColor" />;
      case Suit.CLUBS: return <Club className={className} fill="currentColor" />;
      case Suit.SPADES: return <Spade className={className} fill="currentColor" />;
      case Suit.JOKER: return <Bot className={className} />;
      default: return null;
    }
  };

  const getSuitColor = (card: Card) => card.isRed ? "text-red-500" : "text-slate-900";

  if (!card) {
     // Placeholder for empty deck
     return (
        <div className="w-64 h-96 border-4 border-dashed border-slate-600 rounded-2xl flex items-center justify-center opacity-50">
            <span className="text-slate-500 font-bold text-xl">牌堆已空</span>
        </div>
     );
  }

  return (
    <div 
      className={`relative w-64 h-96 transition-all duration-500 transform cursor-pointer perspective-1000`}
      onClick={onClick}
    >
      {/* Container that flips */}
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        
        {/* Front of Card (Visible when NOT flipped - The Back Pattern) */}
        <div 
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-200 bg-indigo-600"
            style={{ backfaceVisibility: 'hidden' }}
        >
            {/* Pattern */}
            <div className="w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-300 to-slate-500" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #4f46e5 25%, transparent 25%, transparent 75%, #4f46e5 75%, #4f46e5), repeating-linear-gradient(45deg, #4f46e5 25%, #1e1b4b 25%, #1e1b4b 75%, #4f46e5 75%, #4f46e5)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-indigo-900 rounded-full p-4 border-2 border-indigo-400">
                    <span className="text-2xl font-bold text-indigo-100">抽牌</span>
                </div>
            </div>
        </div>

        {/* Back of Card (Visible when FLIPPED - The actual card face) */}
        <div 
            className={`absolute w-full h-full backface-hidden rounded-2xl shadow-2xl bg-white flex flex-col justify-between p-4 select-none ${getSuitColor(card)}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
            {/* Top Left */}
            <div className="flex flex-col items-center self-start">
                <span className="text-4xl font-bold leading-none font-marker">{card.value}</span>
                {renderSuit(card.suit, "w-6 h-6 mt-1")}
            </div>

            {/* Center Big Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 {renderSuit(card.suit, "w-32 h-32")}
            </div>

            {/* Bottom Right */}
            <div className="flex flex-col items-center self-end rotate-180">
                <span className="text-4xl font-bold leading-none font-marker">{card.value}</span>
                {renderSuit(card.suit, "w-6 h-6 mt-1")}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;