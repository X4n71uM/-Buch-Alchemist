
export enum Audience {
  Children = "Für junge, erwachende Geister (Kinder)",
  Adults = "Für weise, suchende Seelen (Erwachsene)",
}

export enum WritingStyle {
  Poetic = "Poetischer Seelengesang",
  Dynamic = "Dynamischer Energiefluss",
  Humorous = "Herzliches Lachen des Universums",
  Wise = "Weisheit der Zeitalter",
}

export enum Genre {
  Fantasy = "Fantasy",
  SciFi = "Science-Fiction",
  Adventure = "Abenteuer",
  FairyTale = "Märchen",
  Spiritual = "Lebenshilfe/Spiritueller Ratgeber",
}

export enum Scope {
  Spark = "Seelenfunke (~20-40 S.)",
  Heartbeat = "Herzschlag (~80-120 S.)",
  Epic = "Epos des Lebens (~200+ S.)",
}

export enum AiProvider {
  Gemini = "Google Gemini",
  OpenAI = "OpenAI GPT",
}

export interface BookData {
  story: string;
  coreMessage: string;
  emotions: string[];
  audience: Audience;
  writingStyle: WritingStyle;
  genre: Genre;
  title: string;
  author: string;
  scope: Scope;
}

export interface Project {
  id: string;
  name: string;
  data: BookData;
  pages: string[];
  createdAt: number;
  currentStep: number;
}