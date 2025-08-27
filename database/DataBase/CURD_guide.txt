-- ===================================================
-- GUIDA CRUD: Esempi base per operazioni su tabelle
-- ===================================================

-- CREATE: Inserimento di un nuovo utente
INSERT INTO utenti (nome, cognome, email, telefono)
VALUES ('Giulia', 'Verdi', 'giulia.verdi@example.com', '+39 333 1122334');

-- READ: Selezionare tutti gli utenti
SELECT * FROM utenti;

-- READ: Selezionare prenotazioni confermate di un utente specifico
SELECT p.id_prenotazione, d.data, d.ora_inizio, d.ora_fine, p.stato
FROM prenotazioni p
JOIN disponibilita d ON p.id_disponibilita = d.id_disponibilita
WHERE p.id_utente = 1 AND p.stato = 'confermata';

-- UPDATE: Aggiornare il numero di telefono di un utente
UPDATE utenti
SET telefono = '+39 333 4455667'
WHERE id_utente = 1;

-- DELETE: Cancellare un pagamento specifico
DELETE FROM pagamenti
WHERE id_pagamento = 1;

-- DELETE: Cancellare una prenotazione (cancella anche i pagamenti collegati per ON DELETE CASCADE)
DELETE FROM prenotazioni
WHERE id_prenotazione = 2;
