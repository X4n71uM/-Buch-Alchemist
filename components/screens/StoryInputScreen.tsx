import React from 'react';
import type { BookData } from '../../types';
import { StepWrapper } from '../StepWrapper';
import { FeatherIcon } from '../icons/FeatherIcon';

interface StoryInputScreenProps {
  data: BookData;
  updateData: (data: Partial<BookData>) => void;
  onNext: () => void;
  onSave: () => void;
  onExit: () => void;
}

export const StoryInputScreen: React.FC<StoryInputScreenProps> = ({ data, updateData, onNext, onSave, onExit }) => {
  return (
    <StepWrapper step={1} title="Die Essenz deiner Geschichte" onNext={onNext} onBack={()=>{}} isFirstStep={true} isNextDisabled={!data.story} onSave={onSave} onExit={onExit}>
      <label htmlFor="story" className="flex items-center text-lg font-light text-slate-300 mb-2">
        <FeatherIcon className="w-5 h-5 mr-2 text-yellow-400" />
        Deine Story
      </label>
      <p className="text-slate-400 mb-4 text-sm">
        Lass die Geschichte durch dich fließen. Erzähle frei, was sich zeigen möchte...
      </p>
      <textarea
        id="story"
        value={data.story}
        onChange={(e) => updateData({ story: e.target.value })}
        placeholder="Es war einmal in einem Land voller leuchtender Wälder..."
        rows={10}
        className="w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
      />
    </StepWrapper>
  );
};