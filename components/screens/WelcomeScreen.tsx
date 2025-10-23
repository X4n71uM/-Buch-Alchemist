
import React from 'react';
import { Button } from '../ui/Button';
import { LotusIcon } from '../icons/LotusIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import type { Project } from '../../types';

interface WelcomeScreenProps {
  projects: Project[];
  onStartNew: () => void;
  onLoadProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onShowApiKeySetup: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ projects, onStartNew, onLoadProject, onDeleteProject, onShowApiKeySetup }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 text-slate-100 animate-fade-in relative">
      <Button variant="ghost" onClick={onShowApiKeySetup} className="absolute top-4 right-4 p-3" aria-label="API Schlüssel einstellen">
        <SettingsIcon className="w-6 h-6" />
      </Button>
      <LotusIcon className="w-24 h-24 text-yellow-400 mb-6 animate-pulse-slow"/>
      <h1 className="text-5xl md:text-7xl font-thin tracking-widest uppercase text-slate-200">
        Buch-Alchemist
      </h1>
      <p className="mt-4 mb-8 text-lg md:text-xl text-slate-300 font-light max-w-2xl">
        Verwandle die Intention deiner Seele in ein unvergängliches Werk.
      </p>
      <Button onClick={onStartNew} className="px-10 py-4 text-lg animate-pulse">
        Beginne eine neue Schöpfung
      </Button>

      {projects.length > 0 && (
        <div className="mt-16 w-full max-w-lg">
            <h2 className="text-2xl text-yellow-300 font-light tracking-wider mb-6">Deine Werke</h2>
            <ul className="space-y-3 text-left">
                {projects.sort((a,b) => b.createdAt - a.createdAt).map(p => (
                    <li key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex justify-between items-center transition-all hover:border-yellow-400">
                        <div>
                            <button onClick={() => onLoadProject(p.id)} className="text-lg text-slate-200 hover:text-yellow-300 font-semibold">{p.name}</button>
                            <p className="text-xs text-slate-400 mt-1">
                                Erstellt am: {new Date(p.createdAt).toLocaleDateString('de-DE')}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }} 
                            className="text-slate-500 hover:text-red-400 transition-colors p-2"
                            aria-label={`Projekt ${p.name} löschen`}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};