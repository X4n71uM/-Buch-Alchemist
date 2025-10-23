
import React, { useState, useEffect } from 'react';
import { LotusIcon } from '../icons/LotusIcon';
import { AFFIRMATIONS } from '../../constants';

interface ManifestingScreenProps {
    progress?: number;
}

export const ManifestingScreen: React.FC<ManifestingScreenProps> = ({ progress = 0 }) => {
    const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);

    useEffect(() => {
        if (progress > 0) return; // Don't cycle affirmations if showing progress
        const interval = setInterval(() => {
            setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, [progress]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 text-slate-100 animate-fade-in">
            <LotusIcon className="w-24 h-24 text-yellow-400 mb-8 animate-spin-slow" />
            <h2 className="text-3xl md:text-4xl font-light tracking-wider text-slate-200 mb-4">
                {progress > 0 ? `Seite ${progress} wird manifestiert...` : 'Die Magie kristallisiert sich...'}
            </h2>
            {progress === 0 && (
                <p className="text-slate-300 text-lg transition-opacity duration-1000">
                    {affirmation}
                </p>
            )}
        </div>
    );
};
