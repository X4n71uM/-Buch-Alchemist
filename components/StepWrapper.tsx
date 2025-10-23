import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { STEPS } from '../constants';

interface StepWrapperProps {
  step: number;
  title: string;
  onNext: () => void;
  onBack: () => void;
  onSave?: () => void;
  onExit?: () => void;
  isNextDisabled?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  children: React.ReactNode;
  lastStepActions?: React.ReactNode;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({ step, title, onNext, onBack, onSave, onExit, isNextDisabled = false, isFirstStep = false, isLastStep = false, children, lastStepActions }) => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleSave = () => {
    if (onSave) {
        onSave();
        setShowSaveConfirmation(true);
    }
  };

  useEffect(() => {
    if (showSaveConfirmation) {
        const timer = setTimeout(() => setShowSaveConfirmation(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-moonstone-100 text-[#f0f4f8] animate-fade-in relative">
      {onExit && (
        <Button 
          variant="ghost" 
          onClick={onExit} 
          className="absolute top-4 left-4 z-20 px-4 py-2 text-sm"
          aria-label="Zurück zur Projektübersicht"
        >
           &larr; Projekte
        </Button>
      )}
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <p className="text-yellow-400 font-semibold mb-2">Schritt {step} von {STEPS.length}</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-wider text-slate-200">{title}</h2>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20 space-y-6">
            {children}
        </div>

        <div className="flex justify-between items-center mt-8">
            {!isFirstStep ? (
                <Button variant="ghost" onClick={onBack}>
                    &larr; Zurück
                </Button>
            ) : <div></div>}
            <div className="flex items-center gap-4">
              {onSave && !isLastStep && (
                <div className="relative">
                  <Button variant="secondary" onClick={handleSave} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Speichern
                  </Button>
                  {showSaveConfirmation && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md animate-fade-in-out">
                      Gespeichert!
                    </span>
                  )}
                </div>
              )}
               {isLastStep && lastStepActions ? (
                    lastStepActions
                ) : (
                    <Button onClick={onNext} disabled={isNextDisabled} className={!isLastStep ? 'animate-pulse-slow' : ''}>
                        {isLastStep ? 'Manifestiere dieses Buch!' : 'Weiter'} &rarr;
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};