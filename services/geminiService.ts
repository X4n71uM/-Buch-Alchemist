
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import type { BookData } from '../types';
import { AiProvider } from '../types';
import { buildMasterPrompt, buildOpenAIMessages } from '../constants';

// --- Abstract Chat Session ---
export interface ChatSession {
    sendMessage(message?: string): Promise<string>;
}

// --- Gemini Implementation ---
class GeminiChatSession implements ChatSession {
    private chat: GeminiChat;

    constructor(chat: GeminiChat) {
        this.chat = chat;
    }

    async sendMessage(message: string = 'next'): Promise<string> {
        const result = await this.chat.sendMessage({ message });
        return result.text;
    }
}

// --- OpenAI Implementation ---
type OpenAIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

class OpenAIChatSession implements ChatSession {
    private history: OpenAIMessage[];
    private apiKey: string;
    private model = 'gpt-4o-mini';
    // Maintain a sliding window of the last 20 messages (10 pairs) to provide recent context.
    private readonly CONVERSATION_WINDOW_SIZE = 20;
    
    constructor(initialMessages: OpenAIMessage[], apiKey: string) {
        this.history = [...initialMessages];
        this.apiKey = apiKey;
    }

    async sendMessage(message: string = 'next'): Promise<string> {
        // Add the new user message to the full history
        this.history.push({ role: 'user', content: message });

        // Prepare the messages to be sent to the API
        const setupMessages = this.history.slice(0, 3); // system, initial user, initial assistant
        const conversationMessages = this.history.slice(3);

        // To prevent exceeding token limits, we only send the setup messages + a sliding window of recent conversation
        const messagesToSend = conversationMessages.length > this.CONVERSATION_WINDOW_SIZE
            ? [
                ...setupMessages, 
                ...conversationMessages.slice(-this.CONVERSATION_WINDOW_SIZE)
              ]
            : this.history;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messagesToSend,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Log the detailed error object for debugging
            console.error("OpenAI API Error:", JSON.stringify(errorData, null, 2));
            const errorMessage = errorData.error?.message || response.statusText;
            throw new Error(`OpenAI API Fehler: ${errorMessage}`);
        }

        const data = await response.json();
        const assistantMessageContent = data.choices[0]?.message?.content;
        
        if (typeof assistantMessageContent !== 'string') {
             throw new Error("Ungültige Antwort von der OpenAI API erhalten.");
        }

        // Add the assistant's response to the full history for local record-keeping
        this.history.push({ role: 'assistant', content: assistantMessageContent });
        return assistantMessageContent;
    }
}


export const startChatSession = (data: BookData, apiKey: string, provider: AiProvider): ChatSession => {
    if (!apiKey) {
        throw new Error("API-Schlüssel nicht für startChatSession bereitgestellt");
    }

    switch (provider) {
        case AiProvider.Gemini: {
            const ai = new GoogleGenAI({ apiKey });
            const masterPrompt = buildMasterPrompt(data);

            const geminiChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: [
                    {
                        role: "user",
                        parts: [{ text: masterPrompt }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Verstanden. Ich bin bereit, die Schöpfung zu beginnen. Ich werde mit der Cover-Vision starten und dann auf den Befehl 'next' für jede weitere Seite warten." }],
                    }
                ],
            });
            return new GeminiChatSession(geminiChat);
        }
        case AiProvider.OpenAI: {
            const initialMessages = buildOpenAIMessages(data);
            return new OpenAIChatSession(initialMessages, apiKey);
        }
        default:
            throw new Error(`Nicht unterstützter AI-Anbieter: ${provider}`);
    }
};
