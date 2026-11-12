# Better Together — questionario soci (prova)

Versione aggiornata senza il testo sopra la pagina iniziale e finale e senza il badge giallo nella testata.

Questa è una versione dimostrativa offline del sito di compilazione, basata esclusivamente sul documento **Questionario_Better_Together_full.docx**.

## Come provarlo

1. Estrai il contenuto dello ZIP, senza separare i file.
2. Apri `index.html` con Firefox o Chrome.
3. Compila il questionario. Ogni domanda mostrata richiede una risposta; i filtri operano automaticamente.
4. Al termine premi **Scarica le risposte CSV**. Le risposte non sono inviate online.

Il sito contiene **un unico questionario**: non ci sono profili, categorie di soci o filtri basati sui dati amministrativi. La navigazione è una domanda per pagina, ad eccezione delle quattro batterie A5–A6, B1–B5, B9V e B13, presentate come batterie in una sola schermata. Le lettere e i numeri delle domande non sono mostrati ai rispondenti.

## Filtri testati

- P3: P2 indica pausa/interruzione e P1 almeno due presenze
- B2: B1 indica almeno una volta in cui il socio ha lavorato/studiato al ritrovo
- B8: B7N indica una specifica attività
- B9V e B12S: B9 indica una sede
- D1R: P2 indica pausa o interruzione
- G4 e G7: dipendono da G3

Le domande non mostrate vengono registrate con `FILTERED` nella relativa colonna del CSV. Le alternative non numeriche non sono codificate come valori delle scale. Le opzioni multiple sono salvate come codici separati da punto e virgola. Gli identificativi delle colonne corrispondono alle sigle del documento Word.

## Identificativo pseudonimo di prova

Puoi simulare un link individuale con `index.html?token=BT-PROVA-001`. Il codice viene inserito nella colonna `id_rispondente` del CSV. In questa versione, il token nell'URL non è autenticato: **non è una soluzione idonea a proteggere dati reali**.

## Da completare prima della somministrazione

- **B7N e B9:** il Word non contiene l'elenco definitivo delle singole attività e delle sedi. Sono quindi presenti alcune voci **dimostrative**, da sostituire con gli elenchi ufficiali. Non sono dati o categorie approvati.
- Configurare il collegamento sicuro al sistema di raccolta (ad esempio Google Apps Script/Google Sheets), i controlli di unicità dei codici e le politiche di accesso ai dati.
- Integrare l'informativa privacy dell'associazione e verificare il testo dell'introduzione prima dell'invio.

## File

- `index.html` — struttura della pagina
- `styles.css` — veste grafica
- `logo.png` — marchio fornito dall'associazione, con sfondo reso trasparente per l'intestazione viola
- `questions.js` — domande, opzioni e batterie
- `app.js` — navigazione, filtri, validazione, randomizzazione ed esportazione CSV

## Verifiche eseguite

Quattro compilazioni complete simulate, da 35 a 42 schermate, con combinazioni differenti di P1/P2, attività, sedi, B1 e occupazione; controllo del blocco di avanzamento senza risposta; verifica della navigazione e dell'assenza di overflow orizzontale nei viewport testati da 360 a 1200 pixel. Il prototipo non è ancora stato sottoposto a pretest con soci reali.
