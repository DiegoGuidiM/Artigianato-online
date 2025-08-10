-- =========================================
-- SETUP INIZIALE DATABASE COWORKSPACE
-- Autore: Diego Guidi (Database Developer)
-- Descrizione: Creazione di tabelle per utenti, sedi,
--              disponibilità, prenotazioni e pagamenti.
-- DB: PostgreSQL
-- =========================================

-- 1. Creazione database (eseguire solo se non esiste)
-- CREATE DATABASE coworkspace_db;

-- Usare il database
-- \c coworkspace_db;

-- =========================================
-- 2. TABELLE
-- =========================================

-- Utenti
CREATE TABLE utenti (
    id_utente SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ruolo VARCHAR(20) NOT NULL,
    CONSTRAINT chk_email CHECK (email LIKE '%@%')
);

-- Sedi
CREATE TABLE sedi (
    id_sede SERIAL PRIMARY KEY,
    nome_sede VARCHAR(100) NOT NULL,
    indirizzo TEXT NOT NULL,
    citta VARCHAR(50) NOT NULL,
    paese VARCHAR(50) NOT NULL
);

-- Disponibilità
CREATE TABLE disponibilita (
    id_disponibilita SERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    data DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    posti_disponibili INT NOT NULL CHECK (posti_disponibili >= 0),
    FOREIGN KEY (id_sede) REFERENCES sedi(id_sede) ON DELETE CASCADE
);

-- Prenotazioni
CREATE TABLE prenotazioni (
    id_prenotazione SERIAL PRIMARY KEY,
    id_utente INT NOT NULL,
    id_disponibilita INT NOT NULL,
    data_prenotazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stato VARCHAR(20) DEFAULT 'in_attesa' CHECK (stato IN ('in_attesa', 'confermata', 'annullata')),
    FOREIGN KEY (id_utente) REFERENCES utenti(id_utente) ON DELETE CASCADE,
    FOREIGN KEY (id_disponibilita) REFERENCES disponibilita(id_disponibilita) ON DELETE CASCADE
);

-- Pagamenti
CREATE TABLE pagamenti (
    id_pagamento SERIAL PRIMARY KEY,
    id_prenotazione INT NOT NULL,
    importo NUMERIC(10, 2) NOT NULL CHECK (importo >= 0),
    metodo_pagamento VARCHAR(30) NOT NULL CHECK (metodo_pagamento IN ('carta', 'paypal', 'bonifico')),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_prenotazione) REFERENCES prenotazioni(id_prenotazione) ON DELETE CASCADE
);

-- =========================================
-- 3. INDICI
-- =========================================
CREATE INDEX idx_utenti_email ON utenti(email);
CREATE INDEX idx_disponibilita_data ON disponibilita(data);
CREATE INDEX idx_prenotazioni_stato ON prenotazioni(stato);

-- =========================================
-- 4. DATI INIZIALI
-- =========================================

-- Utenti
INSERT INTO utenti (nome, cognome, email, telefono) VALUES
('Mario', 'Rossi', 'mario.rossi@example.com', '+39 333 1234567'),
('Luca', 'Bianchi', 'luca.bianchi@example.com', '+39 333 9876543');

-- Sedi
INSERT INTO sedi (nome_sede, indirizzo, citta, paese) VALUES
('CoWork Milano', 'Via Roma 10', 'Milano', 'Italia'),
('CoWork Torino', 'Corso Francia 200', 'Torino', 'Italia');

-- Disponibilità
INSERT INTO disponibilita (id_sede, data, ora_inizio, ora_fine, posti_disponibili) VALUES
(1, '2025-08-10', '09:00', '13:00', 10),
(1, '2025-08-10', '14:00', '18:00', 8),
(2, '2025-08-11', '09:00', '13:00', 12);

-- Prenotazioni
INSERT INTO prenotazioni (id_utente, id_disponibilita, stato) VALUES
(1, 1, 'confermata'),
(2, 2, 'in_attesa');

-- Pagamenti
INSERT INTO pagamenti (id_prenotazione, importo, metodo_pagamento) VALUES
(1, 50.00, 'carta');

-- =========================================
-- FINE SETUP
-- =========================================

