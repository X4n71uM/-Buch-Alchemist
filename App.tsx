
import React, { useState, useEffect, useCallback } from 'react';
import type { BookData, Project } from './types';
import { Audience, WritingStyle, Genre, Scope, AiProvider } from './types';
import { startChatSession } from './services/geminiService';
import type { ChatSession } from './services/geminiService';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { ApiKeySetupScreen } from './components/screens/ApiKeySetupScreen';
import { StoryInputScreen } from './components/screens/StoryInputScreen';
import { SoulScreen } from './components/screens/SoulScreen';
import { AudienceScreen } from './components/screens/AudienceScreen';
import { DetailsScreen } from './components/screens/DetailsScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { ManifestingScreen } from './components/screens/ManifestingScreen';
import { MomentOfCreationScreen } from './components/screens/MomentOfCreationScreen';
import { ReaderScreen } from './components/screens/ReaderScreen';

const PROJECTS_STORAGE_KEY = 'buchAlchemistProjects';
const ACTIVE_PROJECT_ID_KEY = 'buchAlchemistActiveProjectId';
const API_CONFIG_STORAGE_KEY = 'buchAlchemistApiConfig';

interface ApiConfig {
    provider: AiProvider;
    key: string;
}

const getInitialProjects = (): Project[] => {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

const getInitialActiveProjectId = (): string | null => {
    return localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
};

const getInitialApiConfig = (): ApiConfig | null => {
    const saved = localStorage.getItem(API_CONFIG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
};

const App: React.FC = () => {
    const [apiConfig, setApiConfig] = useState<ApiConfig | null>(getInitialApiConfig);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [projects, setProjects] = useState<Project[]>(getInitialProjects);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(getInitialActiveProjectId);
    const [chat, setChat] = useState<ChatSession | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFetchingNext, setIsFetchingNext] = useState(false);
    const [autoGenerationProgress, setAutoGenerationProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    useEffect(() => {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        if (activeProjectId) {
            localStorage.setItem(ACTIVE_PROJECT_ID_KEY, activeProjectId);
        } else {
            localStorage.removeItem(ACTIVE_PROJECT_ID_KEY);
        }
    }, [activeProjectId]);
    
    useEffect(() => {
        if (apiConfig) {
            localStorage.setItem(API_CONFIG_STORAGE_KEY, JSON.stringify(apiConfig));
        } else {
            localStorage.removeItem(API_CONFIG_STORAGE_KEY);
        }
    }, [apiConfig]);

    const handleKeySubmit = (newConfig: ApiConfig) => {
        localStorage.setItem(API_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
        setApiConfig(newConfig);
        setShowApiKeyModal(false);
    };

    const updateActiveProject = (update: Partial<Project> | ((p: Project) => Partial<Project>)) => {
        if (!activeProject) return;
        setProjects(prevProjects =>
            prevProjects.map(p => {
                if (p.id === activeProjectId) {
                    const changes = typeof update === 'function' ? update(p) : update;
                    return { ...p, ...changes };
                }
                return p;
            })
        );
    };

    const updateFormData = (data: Partial<BookData>) => {
        updateActiveProject(p => ({
            data: { ...p.data, ...data },
            ...(data.title && { name: data.title || 'Unbenanntes Projekt' })
        }));
    };
    
    const setStep = (step: number) => updateActiveProject({ currentStep: step });
    const handleNext = () => updateActiveProject(p => ({ currentStep: p.currentStep + 1 }));
    const handleBack = () => updateActiveProject(p => ({ currentStep: p.currentStep - 1 }));
    const handleExitProject = () => setActiveProjectId(null);

    const handleStartNewProject = () => {
        const newProject: Project = {
            id: `project_${Date.now()}`,
            name: 'Unbenanntes Projekt',
            createdAt: Date.now(),
            currentStep: 1,
            data: {
                story: '', coreMessage: '', emotions: [], audience: Audience.Adults,
                writingStyle: WritingStyle.Poetic, genre: Genre.Fantasy,
                title: '', author: '', scope: Scope.Heartbeat,
            },
            pages: [],
        };
        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(newProject.id);
    };

    const handleLoadProject = (id: string) => {
        setActiveProjectId(id);
    };

    const handleDeleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (activeProjectId === id) {
            setActiveProjectId(null);
        }
    };

    const processAndSetPages = (newPages: string[]) => {
        if (newPages.length > 0) {
            updateActiveProject(p => ({ pages: [...p.pages, ...newPages] }));
        }
    };

    const startManifestation = useCallback(async () => {
        if (!activeProject || !apiConfig) return;
        setError(null);
        setIsGenerating(true);
        updateActiveProject({ pages: [] });
        setStep(7); // Manifesting screen
        try {
            const chatSession = startChatSession(activeProject.data, apiConfig.key, apiConfig.provider);
            setChat(chatSession);
            const firstChunk = await chatSession.sendMessage('Beginne jetzt mit der Cover-Vision.');
            processAndSetPages(firstChunk.split('---').map(p => p.trim()).filter(p => p));
            setStep(8); // Moment of Creation screen
        } catch (e) {
            console.error(e);
            setError("Ein Fehler ist bei der Kommunikation mit der schöpferischen Energie aufgetreten. Bitte versuche es erneut.");
            setStep(6); // Go back to summary
        } finally {
            setIsGenerating(false);
        }
    }, [activeProject, apiConfig]);

    const startFullManifestation = useCallback(async () => {
        if (!activeProject || !apiConfig) return;
        setError(null);
        setIsGenerating(true);
        setAutoGenerationProgress(0);
        updateActiveProject({ pages: [] });
        setStep(7); // Go to Manifesting screen

        try {
            const chatSession = startChatSession(activeProject.data, apiConfig.key, apiConfig.provider);
            setChat(chatSession);

            let isFinished = false;
            const maxPages = 350; // Safety limit
            let accumulatedPages: string[] = [];
            
            // First page needs a specific prompt
            const firstChunk = await chatSession.sendMessage('Beginne jetzt mit der Cover-Vision.');
            const firstPages = firstChunk.split('---').map(p => p.trim()).filter(p => p);

            if (firstPages.length > 0) {
                accumulatedPages = [...accumulatedPages, ...firstPages];
                updateActiveProject({ pages: accumulatedPages });
                setAutoGenerationProgress(accumulatedPages.length);
            } else {
                 isFinished = true;
            }

            if (!isFinished) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }


            for (let i = 1; i < maxPages && !isFinished; i++) {
                let nextChunk = '';
                let success = false;
                let retries = 0;
                const maxRetries = 5;
                let delay = 1500; // Start with 1.5 seconds delay on first retry

                while (!success && retries < maxRetries) {
                    try {
                        nextChunk = await chatSession.sendMessage('next');
                        success = true;
                    } catch (e) {
                        const isRateLimitError = e instanceof Error && (e.message.includes('429') || e.message.includes('RESOURCE_EXHAUSTED'));
                        
                        if (isRateLimitError && retries < maxRetries - 1) {
                            console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${retries + 1})`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            delay *= 2; // Exponential backoff
                            retries++;
                        } else {
                            throw e;
                        }
                    }
                }
                
                const newPages = nextChunk.split('---').map(p => p.trim()).filter(p => p);
                
                if(newPages.length > 0) {
                    accumulatedPages = [...accumulatedPages, ...newPages];
                    updateActiveProject({ pages: accumulatedPages });
                    setAutoGenerationProgress(accumulatedPages.length);

                    const lastPageContent = newPages[newPages.length - 1].toLowerCase();
                    if (lastPageContent.includes("ende der buch-manifestation") || lastPageContent.includes("habe meinen teil der schöpfung vollendet")) {
                        isFinished = true;
                    }
                } else {
                    isFinished = true;
                }

                if (!isFinished) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            setStep(8); // Moment of Creation screen

        } catch (e) {
            console.error(e);
            setError("Die Verbindung zur Quelle wurde unterbrochen. Das bisher erschaffene Werk wurde gespeichert. Du kannst es nun lesen.");
            setStep(8); // Go to Moment of Creation even on error, to see partial result
        } finally {
            setIsGenerating(false);
            setAutoGenerationProgress(0);
        }
    }, [activeProject, apiConfig]);

    const fetchNextPage = useCallback(async () => {
        if (!chat || isFetchingNext || !activeProject) return;

        const lastPage = activeProject.pages[activeProject.pages.length - 1] || '';
        if (lastPage.includes("ist fertiggestellt") || lastPage.includes("Ende der Buchmanifestation") || lastPage.includes("ist nun vollständig")) {
            return;
        }

        setIsFetchingNext(true);
        setError(null);
        try {
            const nextChunk = await chat.sendMessage();
            processAndSetPages(nextChunk.split('---').map(p => p.trim()).filter(p => p));
        } catch (e) {
            console.error(e);
            setError("Die Verbindung zur Quelle wurde unterbrochen. Bitte versuche es erneut.");
        } finally {
            setIsFetchingNext(false);
        }
    }, [chat, isFetchingNext, activeProject]);

    const renderStep = () => {
        if (!activeProject) {
            return <WelcomeScreen projects={projects} onStartNew={handleStartNewProject} onLoadProject={handleLoadProject} onDeleteProject={handleDeleteProject} onShowApiKeySetup={() => setShowApiKeyModal(true)} />;
        }
        
        const props = {
            data: activeProject.data,
            updateData: updateFormData,
            onBack: handleBack,
            onSave: () => {}, // The app auto-saves, this is for the button presence
            onExit: handleExitProject,
        };

        switch (activeProject.currentStep) {
            case 1: return <StoryInputScreen {...props} onNext={handleNext} />;
            case 2: return <SoulScreen {...props} onNext={handleNext} />;
            case 3: return <AudienceScreen {...props} onNext={handleNext} />;
            case 4: return <DetailsScreen {...props} onNext={handleNext} />;
            case 5: return <SummaryScreen {...props} onNext={startManifestation} onFullManifestation={startFullManifestation} editStep={setStep} />;
            case 6: return <SummaryScreen {...props} onNext={startManifestation} onFullManifestation={startFullManifestation} editStep={setStep} error={error} />;
            case 7: return <ManifestingScreen progress={autoGenerationProgress} />;
            case 8: return <MomentOfCreationScreen onRead={() => setStep(9)} />;
            case 9: return <ReaderScreen 
                        pages={activeProject.pages} 
                        onNextPage={fetchNextPage} 
                        isFetchingNext={isFetchingNext} 
                        onReset={handleStartNewProject} 
                        title={activeProject.data.title} 
                        author={activeProject.data.author} 
                        onExit={() => setActiveProjectId(null)}
                      />;
            default: return <WelcomeScreen projects={projects} onStartNew={handleStartNewProject} onLoadProject={handleLoadProject} onDeleteProject={handleDeleteProject} onShowApiKeySetup={() => setShowApiKeyModal(true)} />;
        }
    };

    if (!apiConfig) {
        return <ApiKeySetupScreen onKeySubmit={handleKeySubmit} />;
    }

    return (
        <main className="bg-[#1a1032] min-h-screen font-sans antialiased relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1a1032] to-black"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="relative z-10">
                {renderStep()}
            </div>
            {showApiKeyModal && <ApiKeySetupScreen onKeySubmit={handleKeySubmit} isModal onClose={() => setShowApiKeyModal(false)} />}
        </main>
    );
};

export default App;