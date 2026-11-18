/* Aggiornamento del questionario BT per il repository marioquaranta/test.
   Si carica DOPO app.js e non modifica CSS, logo o meccanismo CSV originale. */
(function () {
  'use strict';
  const priorActive = window.active;
  const priorMatrixRows = window.matrixRows;
  const priorValueRows = window.valueRows;

  if (typeof priorActive !== 'function' || typeof priorMatrixRows !== 'function' || typeof priorValueRows !== 'function') {
    throw new Error('Il codice di test/app.js non corrisponde alla versione prevista.');
  }
  const chosenActivities = () => Array.isArray(answers.B7?.v) ? answers.B7.v : [];

  window.active = function (question) {
    if (question.id === 'B8') {
      return chosenActivities().some(code => /^F\d+$/.test(code));
    }
    return priorActive(question);
  };

  window.matrixRows = function (question) {
    if (question.id === 'B8') {
      const chosen = chosenActivities();
      // Conserva l'ordine selezionato dal rispondente (massimo tre attività).
      return chosen.map(code => question.rows.find(row => row.activityCode === code)).filter(Boolean);
    }
    return priorMatrixRows(question);
  };

  window.valueRows = function () {
    const result = priorValueRows();
    const chosen = chosenActivities();
    const b8 = QUESTION_MAP.B8;
    if (b8) {
      for (const row of b8.rows) {
        if (!chosen.includes(row.activityCode)) result[row.id] = 'FILTERED';
      }
    }
    return result;
  };
})();
