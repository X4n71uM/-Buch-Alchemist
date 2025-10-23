import React from 'react';
import type { BookData } from '../../types';
import { StepWrapper } from '../StepWrapper';
import { Button } from '../ui/Button';

interface SummaryScreenProps {
  data: BookData;
  onNext: () => void; // Becomes the step-by-step manifestation
  onFullManifestation: () => void; // New prop for one-click manifestation
  onBack: () => void;
  editStep: (step: number) => void;
  onSave: () => void;
  onExit: () => void;
  error?: string | null;
}

const SummaryItem: React.FC<{ label: string; value: string | string[]; onEdit: () => void }> = ({ label, value, onEdit }) => (
    <div className="py-3 border-b border-slate-700 flex justify-between items-start">
        <div>
            <p className="text-sm text-yellow-400">{label}</p>
            <p className="text-slate-200 mt-1">{Array.isArray(value) ? value.join(', ') : value}</p>
        </div>
        <button onClick={onEdit} className="text-xs text-slate-400 hover:text-yellow-300 transition-colors">Ändern</button>
    </div>
);

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ data, onNext, onFullManifestation, onBack, editStep, onSave, onExit, error }) => {
  const lastStepActions = (
    <div className="flex items-center gap-4">
      <Button variant="secondary" onClick={onNext}>
        Seite für Seite beginnen
      </Button>
      <Button variant="primary" onClick={onFullManifestation} className="animate-pulse-slow flex items-center gap-2">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="m13 13-1-4-4 1 1 4 4-1z"/></svg>
        Vollständige Manifestation
      </Button>
    </div>
  );
    
  return (
    <StepWrapper 
        step={5} 
        title="Die Kristallisation der Magie" 
        onNext={onNext} 
        onBack={onBack} 
        isLastStep={true} 
        onSave={onSave}
        lastStepActions={lastStepActions}
        onExit={onExit}
    >
      <p className="text-slate-400 mb-4 text-center">
        Überprüfe die Zutaten deiner Alchemie. Wenn dein Herz 'Ja' sagt, beginne die Manifestation.
      </p>
      <div className="space-y-2">
        <SummaryItem label="Titel & Autor" value={`${data.title} von ${data.author}`} onEdit={() => editStep(4)} />
        <SummaryItem label="Essenz der Story" value={data.story.substring(0, 100) + '...'} onEdit={() => editStep(1)} />
        <SummaryItem label="Kernbotschaft" value={data.coreMessage} onEdit={() => editStep(2)} />
        <SummaryItem label="Emotionen" value={data.emotions} onEdit={() => editStep(2)} />
        <SummaryItem label="Zielgruppe" value={data.audience} onEdit={() => editStep(3)} />
        <SummaryItem label="Stil & Genre" value={`${data.writingStyle}, ${data.genre}`} onEdit={() => editStep(3)} />
        <SummaryItem label="Umfang" value={data.scope} onEdit={() => editStep(4)} />
      </div>
       {error && <p className="mt-4 text-center text-red-400">{error}</p>}
    </StepWrapper>
  );
};