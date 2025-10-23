
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { LotusIcon } from '../icons/LotusIcon';
import { AiProvider } from '../../types';
import { AI_PROVIDER_OPTIONS } from '../../constants';

interface ApiKeySetupScreenProps {
  onKeySubmit: (config: { provider: AiProvider; key: string }) => void;
  isModal?: boolean;
  onClose?: () => void;
}

const providerDetails = {
  [AiProvider.Gemini]: {
    name: 'Google Gemini',
    link: 'https://aistudio.google.com/app/apikey',
    steps: [
      'Besuche Google AI Studio und erstelle einen API-Schlüssel.',
      'Klicke auf "Create API key in new project".',
      'Kopiere den Schlüssel und füge ihn hier ein.'
    ]
  },
  [AiProvider.OpenAI]: {
    name: 'OpenAI GPT',
    link: 'https://platform.openai.com/api-keys',
    steps: [
      'Besuche die OpenAI API-Schlüssel Seite.',
      'Klicke auf "+ Create new secret key".',
      'Kopiere den Schlüssel und füge ihn hier ein.'
    ]
  }
};


export const ApiKeySetupScreen: React.FC<ApiKeySetupScreenProps> = ({ onKeySubmit, isModal = false, onClose }) => {
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState<AiProvider>(AiProvider.Gemini);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onKeySubmit({ provider, key: key.trim() });
    }
  };
  
  const details = providerDetails[provider];

  const content = (
    <div className="w-full max-w-lg mx-auto text-center">
      <LotusIcon className="w-16 h-16 text-yellow-400 mb-6 mx-auto animate-pulse-slow"/>
      <h1 className="text-3xl md:text-4xl font-light tracking-wider text-slate-200 mb-4">
        Verbindung zur Quelle
      </h1>
      <p className="text-slate-300 mb-6">
        Der Buch-Alchemist benötigt einen API-Schlüssel, um die schöpferische Energie zu kanalisieren.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        {AI_PROVIDER_OPTIONS.map(p => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
              provider === p
                ? 'bg-yellow-400 text-slate-900 border-yellow-400'
                : 'bg-transparent text-slate-300 border-slate-600 hover:border-yellow-400'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="text-left bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6 space-y-2 text-sm">
        {details.steps.map((step, i) => <p key={i}>{i+1}. {step}</p>)}
        <a href={details.link} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline inline-block mt-2">
          API-Schlüssel bei {details.name} erstellen &rarr;
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Füge deinen API-Schlüssel hier ein"
          className="w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
          aria-label="API-Schlüssel"
        />
        <Button type="submit" disabled={!key.trim()} className="w-full py-3">
          Speichern & Verbinden
        </Button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="relative bg-[#1a1032] border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
           <Button variant="ghost" onClick={onClose} className="absolute top-2 right-2 px-2 py-1 text-2xl">&times;</Button>
           {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-slate-100 animate-fade-in">
      {content}
    </div>
  );
};