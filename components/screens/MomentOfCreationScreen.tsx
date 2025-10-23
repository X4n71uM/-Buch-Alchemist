
import React from 'react';
import { Button } from '../ui/Button';

interface MomentOfCreationScreenProps {
    onRead: () => void;
}

export const MomentOfCreationScreen: React.FC<MomentOfCreationScreenProps> = ({ onRead }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 text-slate-100 animate-fade-in">
            <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-light tracking-wider text-yellow-300 mb-6">
                    Siehe, was du manifestiert hast.
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10">
                    Deine Intention ist nun Form geworden. Ehre deine Schöpferkraft.
                </p>
                <Button onClick={onRead} className="px-8 py-4">
                    Lies dein Werk
                </Button>
            </div>
        </div>
    );
};
