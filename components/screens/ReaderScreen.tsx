import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '../ui/Button';
import { PlayIcon } from '../icons/PlayIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { StopIcon } from '../icons/StopIcon';

interface ReaderScreenProps {
  pages: string[];
  onNextPage: () => void;
  isFetchingNext: boolean;
  onReset: () => void;
  onExit: () => void;
  title: string;
  author: string;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({ pages, onNextPage, isFetchingNext, onReset, onExit, title, author }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [speakingPageIndex, setSpeakingPageIndex] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(() => localStorage.getItem('buchAlchemistVoiceURI'));

    useEffect(() => {
        const getAndSetVoices = () => {
            const availableVoices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('de'));
            setVoices(availableVoices);
            if (!selectedVoiceURI && availableVoices.length > 0) {
                const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
                setSelectedVoiceURI(defaultVoice.voiceURI);
            }
        };
        // Voices may load asynchronously
        getAndSetVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
             speechSynthesis.onvoiceschanged = getAndSetVoices;
        }

        return () => {
            speechSynthesis.onvoiceschanged = null;
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if(selectedVoiceURI) {
            localStorage.setItem('buchAlchemistVoiceURI', selectedVoiceURI);
        }
    }, [selectedVoiceURI]);
    

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        let y = margin;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 8;
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'normal');
        doc.text(`von ${author}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 15;

        doc.setFontSize(12);

        pages.forEach((pageContent) => {
            const lines = doc.splitTextToSize(pageContent, doc.internal.pageSize.width - margin * 2);
            lines.forEach((line: string) => {
                if (y + 10 > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += 7; // Line height
            });
            y += 10; // Paragraph spacing
        });

        doc.save(`${title.replace(/ /g, '_')}.pdf`);
    };

    const handleDownloadTxt = () => {
        if (!contentRef.current) return;
        const textContent = pages.join('\n\n---\n\n');
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/ /g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handlePlay = (index: number, text: string) => {
        // If it's the same page and it was paused, resume it
        if (speechSynthesis.speaking && isPaused && speakingPageIndex === index) {
            speechSynthesis.resume();
            setIsPaused(false);
            return;
        }
        
        // If any speech is happening, stop it before starting a new one
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        const cleanText = text.replace(/Seite \d+ von ca. \d+/g, '').trim();
        if (!cleanText) return;

        // Split text into sentences to avoid issues with long text.
        const sentences = cleanText.split(/(?<=[.!?])\s+/g);
        
        const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

        const utterances = sentences.map(sentence => {
            const utterance = new SpeechSynthesisUtterance(sentence);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.lang = 'de-DE';
            utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
                console.error('SpeechSynthesisUtterance.onerror:', event.error);
                setSpeakingPageIndex(null);
                setIsPaused(false);
                // Clear the queue on error
                speechSynthesis.cancel();
            };
            return utterance;
        });
        
        // When the last sentence is spoken, reset the state.
        if (utterances.length > 0) {
            utterances[utterances.length - 1].onend = () => {
                setSpeakingPageIndex(null);
                setIsPaused(false);
            };
        }

        // Queue all sentences for speaking.
        utterances.forEach(utterance => speechSynthesis.speak(utterance));

        setSpeakingPageIndex(index);
        setIsPaused(false);
    };

    const handlePause = () => {
        speechSynthesis.pause();
        setIsPaused(true);
    };

    const handleStop = () => {
        speechSynthesis.cancel();
        setSpeakingPageIndex(null);
        setIsPaused(false);
    };

    const isBookFinished = pages.length > 0 && (pages[pages.length - 1].includes("ist fertiggestellt") || pages[pages.length - 1].includes("Ende der Buchmanifestation") || pages[pages.length-1].includes("ist nun vollständig"));

  return (
    <div className="min-h-screen w-full flex flex-col text-slate-200">
      <header className="sticky top-0 bg-[#1a1032]/80 backdrop-blur-md z-20 p-4 flex flex-col sm:flex-row justify-between items-center border-b border-slate-700 print:hidden gap-4">
        <div className="text-center sm:text-left">
            <h1 className="text-xl font-semibold text-yellow-400">{title}</h1>
            <p className="text-sm text-slate-300">von {author}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-2">
                <label htmlFor="voice-select" className="text-sm text-slate-300">Stimme:</label>
                <select 
                    id="voice-select" 
                    value={selectedVoiceURI || ''} 
                    onChange={e => setSelectedVoiceURI(e.target.value)}
                    className="bg-slate-700 text-slate-200 border border-slate-600 rounded-md text-sm p-1 focus:ring-yellow-400 focus:border-yellow-400"
                    >
                    {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
                </select>
            </div>
            <Button onClick={handleDownloadPdf} variant="secondary" className="px-4 py-2 text-sm">Als PDF Speichern</Button>
            <Button onClick={onReset} variant="ghost" className="px-4 py-2 text-sm">Neue Schöpfung</Button>
            <Button onClick={onExit} variant="ghost" className="px-4 py-2 text-sm">Projekte</Button>
        </div>
      </header>
      
      <main id="printable-content" className="flex-grow p-4 md:p-8">
        <div ref={contentRef} className="max-w-3xl mx-auto space-y-8">
          {pages.map((page, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg whitespace-pre-wrap font-serif text-lg leading-relaxed print:shadow-none print:border-none print:p-0 relative group">
                {page}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/50 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    {speakingPageIndex === index && !isPaused ? (
                        <Button onClick={handlePause} variant="ghost" className="p-2 h-auto w-auto rounded-full" aria-label="Pause"><PauseIcon className="w-5 h-5"/></Button>
                    ) : (
                        <Button onClick={() => handlePlay(index, page)} variant="ghost" className="p-2 h-auto w-auto rounded-full" aria-label="Abspielen"><PlayIcon className="w-5 h-5"/></Button>
                    )}
                    {speakingPageIndex === index && (
                        <Button onClick={handleStop} variant="ghost" className="p-2 h-auto w-auto rounded-full" aria-label="Stopp"><StopIcon className="w-5 h-5"/></Button>
                    )}
                </div>
            </div>
          ))}
        </div>
        {!isBookFinished && (
            <div className="max-w-3xl mx-auto mt-8 text-center print:hidden">
                <Button onClick={onNextPage} disabled={isFetchingNext}>
                    {isFetchingNext ? 'Schreibt...' : 'Nächste Seite anfordern'}
                </Button>
            </div>
        )}
      </main>
    </div>
  );
};