import React from 'react';
import type { BookData } from '../../types';
import { StepWrapper } from '../StepWrapper';
import { EMOTIONS } from '../../constants';

interface SoulScreenProps {
  data: BookData;
  updateData: (data: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onExit: () => void;
}

export const SoulScreen: React.FC<SoulScreenProps> = ({ data, updateData, onNext, onBack, onSave, onExit }) => {
  const toggleEmotion = (emotion: string) => {
    const newEmotions = data.emotions.includes(emotion)
      ? data.emotions.filter(e => e !== emotion)
      : [...data.emotions, emotion];
    updateData({ emotions: newEmotions });
  };
  
  const isNextDisabled = !data.coreMessage || data.emotions.length === 0;

  return (
    <StepWrapper step={2} title="Die Seele deines Werkes" onNext={onNext} onBack={onBack} isNextDisabled={isNextDisabled} onSave={onSave} onExit={onExit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="coreMessage" className="block text-lg font-light text-slate-300 mb-2">
            Die Kernbotschaft
          </label>
          <p className="text-slate-400 mb-4 text-sm">
            Was ist die eine Wahrheit, die dein Buch in die Welt tragen soll? Was soll der Leser fühlen und verstehen, nachdem er die letzte Seite gelesen hat?
          </p>
          <input
            type="text"
            id="coreMessage"
            value={data.coreMessage}
            onChange={(e) => updateData({ coreMessage: e.target.value })}
            placeholder="Die wahre Stärke liegt im Mitgefühl..."
            className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-lg font-light text-slate-300 mb-2">
            Die gewünschte Emotion
          </label>
           <p className="text-slate-400 mb-4 text-sm">Wähle die Gefühle, die dein Werk hervorrufen soll.</p>
          <div className="flex flex-wrap gap-3">
            {EMOTIONS.map(emotion => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                  data.emotions.includes(emotion)
                    ? 'bg-yellow-400 text-slate-900 border-yellow-400'
                    : 'bg-transparent text-slate-300 border-slate-600 hover:border-yellow-400'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};