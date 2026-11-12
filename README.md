# Better Together - questionario di prova aggiornato dal Word (5)

Documento di riferimento: Questionario_Better_Together_full(5).docx.

## Aggiornamento
- Le domande A3 su Eventbrite e sull'app ora usano «con» al posto di «su/sulla».
- Le righe di A5–A6 usano «Organizzatori» e «Volontari»; A7 e una sua alternativa sono allineate.
- La batteria B9V ora comprende 8 aspetti. «Disponibilità di microonde» è il nuovo item B9V_8, visualizzato prima del comfort acustico. L'item di comfort acustico mantiene l'identificativo B9V_5: nessuna variabile esistente è stata riassegnata.
- E1, E2 e il ringraziamento finale sono aggiornati al nuovo testo.
- Le modifiche non incidono sul layout o sul motore di filtraggio. Le batterie restano a un item per schermata, con la stessa disposizione su desktop e smartphone.

## Pubblicazione su GitHub
Nel repository marioquaranta/test è sufficiente sostituire **questions.js** e confermare il commit. Gli altri file presenti nello ZIP costituiscono una copia completa e autonoma del sito di test, ma sono identici a quelli della versione precedente.

## Controlli
- JavaScript sintatticamente valido (Node.js)
- 3 compilazioni complete, 60 / 46 / 59 schermate a 320 / 390 / 1200 pixel
- 3 verifiche aggiuntive della batteria B9V con e senza filtro, a 320 / 390 / 1200 pixel
- 73 colonne CSV, inclusa B9V_8; B9V_5 conserva il precedente significato
- Nessun errore JavaScript rilevato nelle prove

## Prima dell'invio reale
- Gli elenchi B7N (attività) e B9 (sedi) sono ancora dimostrativi.
- Le due A3 sono distinte nel file come A3_EVENTBRITE e A3_APP, per evitare sovrapposizioni dei dati.
- Il Word continua a menzionare G7 nelle note ma non include la relativa domanda; non è stata introdotta nel sito.
- La nota metodologica di B9V afferma ancora che gli aspetti sono sette, mentre nel nuovo Word sono otto. La nota non è visibile ai rispondenti.
- I refusi testuali preesistenti, tra cui «in ti sei», «delle seguenti tipi» e «della dell’attività», sono riprodotti fedelmente, senza correzioni autonome.
- I dati restano soltanto nel browser fino all'eventuale esportazione CSV; non vengono inviati a un backend.
