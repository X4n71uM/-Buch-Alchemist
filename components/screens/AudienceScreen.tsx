import React from 'react';
import type { BookData } from '../../types';
import { Audience, WritingStyle, Genre } from '../../types';
import { StepWrapper } from '../StepWrapper';
import { AUDIENCE_OPTIONS, WRITING_STYLE_OPTIONS, GENRE_OPTIONS } from '../../constants';

interface AudienceScreenProps {
  data: BookData;
  updateData: (data: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onExit: () => void;
}

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({ children, className, ...props }) => (
    <div className="relative w-full">
        <select
            {...props}
            className={`w-full py-3 pl-3 pr-10 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors appearance-none ${className}`}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="m6 9 6 6 6-6"/>
            </svg>
        </div>
    </div>
);

export const AudienceScreen: React.FC<AudienceScreenProps> = ({ data, updateData, onNext, onBack, onSave, onExit }) => {
  return (
    <StepWrapper step={3} title="Für wen ist diese Magie bestimmt?" onNext={onNext} onBack={onBack} onSave={onSave} onExit={onExit}>
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-light text-slate-300 mb-3">Zielgruppe</label>
          <div className="flex flex-col sm:flex-row gap-4">
            {AUDIENCE_OPTIONS.map(option => (
              <label key={option} className="flex-1 p-4 bg-slate-900/70 border border-slate-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-yellow-400 has-[:checked]:bg-slate-800">
                <input
                  type="radio"
                  name="audience"
                  value={option}
                  checked={data.audience === option}
                  onChange={(e) => updateData({ audience: e.target.value as Audience })}
                  className="sr-only"
                />
                <span className="text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
            <label htmlFor="writingStyle" className="block text-lg font-light text-slate-300 mb-2">Schreibstil & Energetische Signatur</label>
            <Select id="writingStyle" value={data.writingStyle} onChange={e => updateData({ writingStyle: e.target.value as WritingStyle })}>
                {WRITING_STYLE_OPTIONS.map(style => <option key={style} value={style}>{style}</option>)}
            </Select>
        </div>

        <div>
            <label htmlFor="genre" className="block text-lg font-light text-slate-300 mb-2">Genre</label>
            <Select id="genre" value={data.genre} onChange={e => updateData({ genre: e.target.value as Genre })}>
                {GENRE_OPTIONS.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </Select>
        </div>
      </div>
    </StepWrapper>
  );
};