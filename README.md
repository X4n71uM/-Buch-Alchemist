# Buch-Alchemist 🖋️✨

**Verwandle die Intention deiner Seele in ein unvergängliches Werk.**

Buch-Alchemist ist ein kreativer Partner, der Nutzer durch einen geführten, fast schon heiligen Schöpfungsprozess leitet. Die App transformiert bloße Story-Ideen in wunderschön geschriebene und professionell strukturierte Bücher, indem sie die Kraft moderner KI-Sprachmodelle nutzt.

<p align="center">
  <img alt="Willkommensbildschirm von Buch-Alchemist" src="[https://github.com/X4n71uM/-Buch-Alchemist/blob/main/Unbenannt0.JPG)" width="49%">
  &nbsp;
  <img alt="Der Schöpfungsprozess im Buch-Alchemist" src="[https://github.com/X4n71uM/-Buch-Alchemist/blob/main/Unbenannt1.JPG)" width="49%">
</p>

---

## 🔮 Die Alchemie dahinter

Diese App ist mehr als nur ein Textgenerator. Sie ist als spiritueller Ghostwriter konzipiert, der die Essenz, die Seele und die emotionale Energie einer Idee erfasst, um daraus ein vollständiges Werk zu manifestieren. Der gesamte Prozess ist in eine metaphorische Sprache gekleidet, die den Akt des Schreibens als alchemistischen Prozess der Transformation darstellt.

## ✨ Features

- **Geführter Schöpfungsprozess**: Ein mehrstufiger Wizard hilft dabei, die grundlegenden "Zutaten" des Buches zu definieren:
    - **Die Essenz**: Die grundlegende Story-Idee.
    - **Die Seele**: Die Kernbotschaft und die gewünschten Emotionen.
    - **Die Signatur**: Zielgruppe, Schreibstil und Genre.
    - **Der Name**: Buchtitel, Autorenname und der angestrebte Umfang.
- **KI-gestütztes Schreiben**: Nutzt die Power von Large Language Models, um den Inhalt zu generieren.
    - ✅ **Multi-Provider-Unterstützung**: Kompatibel mit **Google Gemini** und **OpenAI GPT**.
- **Zwei Manifestations-Modi**:
    - **Seite für Seite**: Ideal für einen interaktiven Prozess, bei dem der Nutzer die Kontrolle behält und jede Seite einzeln generieren lässt.
    - **Vollständige Manifestation**: Ein "Ein-Klick"-Prozess, der das gesamte Buch automatisch generiert, inklusive robuster Logik für Rate-Limits und Wiederholungsversuche.
- **Interaktiver Reader**: Ein eleganter, eingebauter Reader zur Ansicht des fertigen Werkes.
- **Text-to-Speech**: Jede Seite kann mithilfe der Web Speech API mit einer Auswahl an deutschen Stimmen vorgelesen werden.
- **Export-Funktionen**:
    - **PDF-Download**: Speichern Sie das fertige Buch als professionell formatiertes PDF.
- **Lokales Projektmanagement**:
    - Erstellen, laden und löschen Sie mehrere Buchprojekte.
    - Der gesamte Fortschritt wird sicher im `localStorage` Ihres Browsers gespeichert – keine Cloud, keine Anmeldung nötig.
- **Responsive & Ästhetisch**: Ein ansprechendes, thematisches Design, das auf allen Geräten funktioniert.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **KI-Integration**:
    - `@google/genai` für die Google Gemini API.
    - Standard `fetch` API für die OpenAI Chat Completions API.
- **PDF-Generierung**: `jspdf`
- **Umgebung**: Eine reine Client-Side-Anwendung ohne Backend. Es wird kein Build-Schritt benötigt; die App läuft direkt im Browser und lädt Abhängigkeiten über ES-Module von einem CDN.

## 🚀 Setup & Ausführung

Da es sich um eine reine Frontend-Anwendung ohne Build-Prozess handelt, ist die Einrichtung denkbar einfach.

1.  **Repository klonen**:
    ```bash
    git clone https://github.com/your-username/buch-alchemist.git
    cd buch-alchemist
    ```
2.  **Im Browser öffnen**:
    - Starten Sie einen einfachen lokalen Webserver im Projektverzeichnis. Ein Tool wie `live-server` für VS Code oder ein Python-Server ist dafür gut geeignet.
      ```bash
      # Wenn Sie Python 3 installiert haben:
      python -m http.server
      ```
    - Öffnen Sie Ihren Browser und navigieren Sie zur Adresse Ihres lokalen Servers (z.B. `http://localhost:8000`).
    - Alternativ können Sie die `index.html`-Datei direkt in Ihrem Browser öffnen, aber die Verwendung eines lokalen Servers wird für eine reibungslose Funktion empfohlen.

3.  **API-Schlüssel konfigurieren**:
    - Beim ersten Start wird die App Sie auffordern, einen API-Schlüssel für entweder Google Gemini oder OpenAI anzugeben.
    - Sie können einen Schlüssel hier erhalten:
        - **Google Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey)
        - **OpenAI**: [OpenAI API Keys](https://platform.openai.com/api-keys)
    - Der Schlüssel wird sicher in Ihrem Browser-Speicher abgelegt.

## 📂 Projektstruktur

```
/
├── components/         # React-Komponenten
│   ├── icons/          # SVG-Icon-Komponenten
│   ├── screens/        # Komponenten für jede "Seite" der App
│   └── ui/             # Allgemeine UI-Elemente (Button, Card)
├── services/           # Logik für die Kommunikation mit externen APIs
│   └── geminiService.ts# Implementierung für Gemini & OpenAI
├── constants.ts        # App-weite Konstanten (Prompts, Optionen)
├── types.ts            # TypeScript-Typdefinitionen
├── App.tsx             # Hauptkomponente mit State-Management
├── index.html          # HTML-Einstiegspunkt
└── index.tsx           # React-Initialisierung
```

## 🤝 Contributing

Beiträge, die die Alchemie verbessern, sind herzlich willkommen! Fühlen Sie sich frei, ein Issue zu öffnen oder einen Pull Request zu erstellen.

## 📜 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.
