# Better Together — prova con 10 soci fittizi

Questa cartella contiene il questionario esistente con una *simulazione locale* dei link individuali.
Nessun dato viene trasmesso a un server. Non usarlo per la raccolta reale.

## Prova su GitHub Pages
1. Carica nella root del repository `marioquaranta/test` i **sei file del sito**:
   `index.html`, `styles.css`, `questions.js`, `app.js`, `logo.png`, `demo-soci.js`.
2. Apri `https://marioquaranta.github.io/test/` senza `?token=`: compare l'elenco dei dieci soci fittizi.
3. Apri un link individuale: la pagina iniziale spiega che la compilazione può essere interrotta e ripresa in qualsiasi momento, **ma soltanto sullo stesso browser e dispositivo** per questa demo. Rispondi a qualche domanda, chiudi e riapri lo stesso link: la compilazione riprende da dove si era interrotta.
4. Prova un secondo link. Le risposte sono indipendenti.
5. Dopo aver completato un questionario, torna all'elenco e seleziona **Esporta CSV delle prove locali**.

L'elenco completo dei dieci link è anche in `link_soci_fittizi.csv` (solo per distribuzione delle prove, **non** necessario su GitHub).

## Limiti importanti
- GitHub Pages è un hosting statico; **non** conserva risposte o progressi. Il salvataggio demo usa `localStorage`, limitato a browser + dispositivo + dominio.
- Aprendo lo stesso link su un telefono diverso non si recupera quanto compilato altrove.
- Se si cancellano i dati del browser o si usa la modalità privata, i progressi possono andare perduti.
- Il CSV aggregato include **solo** le prove fatte nel browser da cui lo si esporta.
- L'elenco di codici è in `demo-soci.js`, pubblicamente visibile sul sito: **mai usare identità, token o risposte reali in questa versione**.
- Il pulsante «Termina» mostra solo la conclusione della prova: **non invia risposte all'associazione**.
- B7N e B9 hanno ancora elenchi dimostrativi; non sono liste definitive di sedi e attività.

## Per la raccolta reale
Servirà un backend sul server dell'associazione, con validazione dei link lato server, salvataggio centralizzato di progressi e risposte, prevenzione dei doppioni, separazione dati anagrafici/dati di risposta, policy privacy, accessi riservati, e esportazione CSV.
