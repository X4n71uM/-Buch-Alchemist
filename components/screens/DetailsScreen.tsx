import React from 'react';
import type { BookData } from '../../types';
import { Scope } from '../../types';
import { StepWrapper } from '../StepWrapper';
import { SCOPE_OPTIONS } from '../../constants';

interface DetailsScreenProps {
  data: BookData;
  updateData: (data: Partial<BookData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onExit: () => void;
}

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, id: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-lg font-light text-slate-300 mb-2">{label}</label>
        <input
            type="text"
            id={id}
            {...props}
            className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
    </div>
);

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ data, updateData, onNext, onBack, onSave, onExit }) => {
  const isNextDisabled = !data.title || !data.author;
  return (
    <StepWrapper step={4} title="Gib deiner Schöpfung einen Namen" onNext={onNext} onBack={onBack} isNextDisabled={isNextDisabled} onSave={onSave} onExit={onExit}>
      <div className="space-y-6">
        <TextInput
            id="title"
            label="Buchtitel"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder="Der Alchemist der Träume"
        />
        <TextInput
            id="author"
            label="Autorenname"
            value={data.author}
            onChange={(e) => updateData({ author: e.target.value })}
            placeholder="Dein Name"
        />

        <div>
          <label className="block text-lg font-light text-slate-300 mb-3">Umfang des Werkes</label>
          <div className="space-y-2">
            {SCOPE_OPTIONS.map(option => (
              <label key={option} className="flex items-center p-3 bg-slate-900/70 border border-slate-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-yellow-400 has-[:checked]:bg-slate-800">
                <input
                  type="radio"
                  name="scope"
                  value={option}
                  checked={data.scope === option}
                  onChange={(e) => updateData({ scope: e.target.value as Scope })}
                  className="h-4 w-4 text-yellow-400 bg-slate-700 border-slate-600 focus:ring-yellow-400 mr-3"
                />
                <span className="text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};