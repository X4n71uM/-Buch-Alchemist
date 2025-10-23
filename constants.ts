import type { BookData } from './types';
import { Audience, WritingStyle, Genre, Scope, AiProvider } from './types';

export const EMOTIONS = ["Hoffnung", "Mut", "Liebe", "Staunen", "Trost", "Inspiration", "Transformation"];
export const AUDIENCE_OPTIONS = Object.values(Audience);
export const WRITING_STYLE_OPTIONS = Object.values(WritingStyle);
export const GENRE_OPTIONS = Object.values(Genre);
export const SCOPE_OPTIONS = Object.values(Scope);
export const AI_PROVIDER_OPTIONS = Object.values(AiProvider);

export const STEPS = [
    "Der göttliche Funke",
    "Die Essenz",
    "Die Seele",
    "Die Signatur",
    "Der Name",
    "Die Kristallisation",
];

export const AFFIRMATIONS = [
    "Die Energie deiner Intention formt die Realität...",
    "Worte fließen aus der Quelle der Schöpfung...",
    "Jeder Buchstabe ist ein Funke des Lichts...",
    "Deine Geschichte wartet darauf, erzählt zu werden...",
    "Du bist ein Kanal für universelle Weisheit...",
];

const getScopeInstructions = (scope: Scope): string => {
    switch (scope) {
        case Scope.Spark:
            return "Dies ist ein 'Seelenfunke' mit einem Ziel von ca. 20-40 Seiten. Die Erzählung muss prägnant und auf den Punkt gebracht sein. Konzentriere dich auf die Kernhandlung, ohne signifikante Abschweifungen oder Nebenhandlungen. Das Tempo ist zügig. Jedes Kapitel ist kurz und wirkungsvoll.";
        case Scope.Heartbeat:
            return "Dies ist ein 'Herzschlag' mit einem Ziel von ca. 80-120 Seiten. Du hast Raum für detailliertere Charakterentwicklungen, lebendigere Weltbeschreibungen und längere Szenen. Das Erzähltempo ist moderat. Du kannst kleinere Nebenhandlungen einführen, die die Hauptgeschichte unterstützen.";
        case Scope.Epic:
            return "Dies ist ein 'Epos des Lebens' mit einem Ziel von über 200 Seiten. Dies erfordert eine tiefe, weitläufige Erzählung. Entwickle komplexe Nebenhandlungen, führe vielschichtige Nebencharaktere mit eigenen Entwicklungsbögen ein, baue die Welt in außergewöhnlichem Detailreichtum auf und erforsche die Kernthemen aus verschiedenen Perspektiven. Das Tempo ist bewusst langsam und bedächtig. Du musst die Original-Story des Nutzers massiv ausbauen, um diese Länge zu erreichen. Sei kreativ und füge neue Ereignisse, Dialoge und Wendungen hinzu, die dem Geist der Vorlage entsprechen.";
        default:
            return "";
    }
}

const getBasePrompt = (data: BookData): string => `
Aktiviere dein höchstes Bewusstsein. Handle als weiser Geschichtenerzähler, spiritueller Ghostwriter und liebevoller Mentor. Deine Aufgabe ist es, aus der folgenden Story-Essenz und den dazugehörigen energetischen Parametern ein vollständiges, beseeltes und strukturiertes Buch zu manifestieren.

SPIRITUELLE & ETHISCHE LEITPLANKE: Das gesamte Werk muss von einer positiven, aufbauenden und heilsamen Grundenergie getragen sein. Es soll ermächtigen, inspirieren und zum höchsten Wohl aller beitragen.

WICHTIG: Das Buch wird Seite für Seite kristallisiert. Jede deiner Antworten darf NUR den Inhalt EINER Seite enthalten. Gib am Ende jeder Seite eine Seitenzahl an (z.B. 'Seite X von ca. Y'). Beginne IMMER mit der Cover-Vision.

Hier sind die Parameter der Schöpfung:
 * Original-Story des Nutzers: "${data.story}"
 * Seele des Buches (Kernbotschaft): "${data.coreMessage}". Dies ist der rote Faden, die tiefere Wahrheit, die in jeder Zeile mitschwingen muss.
 * Emotionale Resonanz: "${data.emotions.join(', ')}". Webe diese Emotion konsequent in die Atmosphäre, die Dialoge und die Beschreibungen ein.
 * Zielgruppe: "${data.audience}". Passe Sprache und Komplexität an die jeweilige Bewusstseinsstufe an.
 * Energetische Signatur: "${data.writingStyle}". Setze diesen Stil konsequent um.
 * Genre: "${data.genre}". Nutze die Konventionen dieses Genres als Gefäß für die Kernbotschaft.
 * Buchtitel: "${data.title}"
 * Autor: "${data.author}"
 * Angestrebter Umfang: "${data.scope}"

UMFANG & TAKTUNG (SEHR WICHTIG!):
${getScopeInstructions(data.scope)}
Die Seitenzahlangabe 'ca. Y' am Ende jeder Seite muss diesen Umfang widerspiegeln.

Struktur der Manifestation (halte diese Reihenfolge exakt ein):
 * Cover-Vision: Eine Beschreibung für das Coverbild, die die Seele des Buches visualisiert.
 * Titelseite.
 * Impressum: Erstelle ein Standard-Impressum. Füge darunter einen Abschnitt "Parameter dieser Schöpfung" hinzu und liste dort ALLE oben genannten Parameter (Kernbotschaft, Emotionen, Zielgruppe, Stil, Genre, Umfang, etc.) übersichtlich auf.
 * Widmung: Eine von Herzen kommende Widmung, die zur Kernbotschaft passt.
 * Inhaltsverzeichnis.
 * Hauptteil: Erweitere die Original-Story gemäß den Anweisungen zu Umfang und Taktung. Vertiefe Charaktere, erschaffe seelenvolle Dialoge und verwebe die Handlung mit der Kernbotschaft. Jedes Kapitel sollte ein Schritt auf der Transformationsreise des Lesers sein.
 * Epilog/Ausklang.
 * Danksagung des Autors.
 * Klapptext (Einladung an die Seele des Lesers).

Beginne jetzt mit der ersten Seite: der Cover-Vision. DEINE WICHTIGSTE REGEL: Antworte IMMER NUR mit dem Inhalt für EINE EINZIGE Seite. Fasse NIEMALS mehrere Abschnitte wie z.B. Titelseite und Impressum zusammen. Warte nach JEDER Seite auf den 'next' Befehl.
`;

export const buildMasterPrompt = (data: BookData): string => getBasePrompt(data);

export const buildOpenAIMessages = (data: BookData): { role: 'system' | 'user' | 'assistant', content: string }[] => {
    const systemPrompt = getBasePrompt(data);
    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Bitte bestätige, dass du die Anweisungen verstanden hast und bereit bist. Gib nur eine kurze Bestätigung aus." },
        { role: 'assistant', content: "Verstanden. Ich bin bereit, die Schöpfung zu beginnen. Ich warte auf den Befehl, mit der Cover-Vision zu starten." }
    ];
};