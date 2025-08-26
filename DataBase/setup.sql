-- ============================================
--  DATABASE SETUP PER LA PIATTAFORMA "CoWorkSpace"
-- ============================================
-- Questo script crea tutte le tabelle necessarie
-- per la gestione di utenti, sedi, disponibilità,
-- prenotazioni e pagamenti.

	
-- ============================================

-- ============================================
-- TABELLA UTENTI
-- ============================================
-- Obiettivo: Memorizzare informazioni sugli utenti della piattaforma
-- Ruolo: Base per autenticazione, gestione profilo e assegnazione prenotazioni
CREATE TABLE Users (
    id_user INT PRIMARY KEY AUTO_INCREMENT, -- ID univoco per ogni utente
    name VARCHAR(100) NOT NULL,              -- Nome dell'utente
    surname VARCHAR(100) NOT NULL,           -- Cognome dell'utente
    email VARCHAR(255) UNIQUE NOT NULL,      -- Email (usata anche per login)
    password VARCHAR(255) NOT NULL,          -- Password cifrata
    role VARCHAR(50) NOT NULL,               -- Ruolo (client, manager, admin)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Data di creazione account
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Ultimo aggiornamento dati
);

-- ============================================
-- TABELLA SEDI
-- ============================================
-- Obiettivo: Memorizzare informazioni sulle sedi di coworking
-- Ruolo: Riferimento per disponibilità e prenotazioni
CREATE TABLE Location (
    id_location INT PRIMARY KEY AUTO_INCREMENT, -- ID univoco per sede
    name VARCHAR(150) NOT NULL,                 -- Nome della sede
    address VARCHAR(255) NOT NULL,              -- Indirizzo completo
    city VARCHAR(100) NOT NULL,                 -- Città
    region VARCHAR(100) NOT NULL,               -- Regione
    country VARCHAR(100) NOT NULL,              -- Paese
    capacity INT NOT NULL,                      -- Capacità totale della sede
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABELLA TIPI DI SPAZIO
-- ============================================
-- Obiettivo: Definire categorie di spazi disponibili
-- Ruolo: Usata per filtrare disponibilità e calcolare tariffe
CREATE TABLE SpaceType (
    id_space_type INT PRIMARY KEY AUTO_INCREMENT, -- ID univoco per tipo di spazio
    name VARCHAR(100) NOT NULL,                   -- Nome del tipo (es. ufficio privato, sala riunioni)
    description VARCHAR(255)                      -- Descrizione opzionale
);

-- ============================================
-- TABELLA SERVIZI
-- ============================================
-- Obiettivo: Elencare i servizi offerti
-- Ruolo: Permette di associare più servizi a più sedi
CREATE TABLE Service (
    id_service INT PRIMARY KEY AUTO_INCREMENT, -- ID univoco servizio
    name VARCHAR(100) NOT NULL                 -- Nome del servizio (es. Wi-Fi, caffè, stampante)
);

-- ============================================
-- TABELLA RELAZIONE SEDI ↔ SERVIZI
-- ============================================
-- Obiettivo: Associare servizi a specifiche sedi
CREATE TABLE LocationService (
    id_location INT NOT NULL,
    id_service INT NOT NULL,
    PRIMARY KEY (id_location, id_service),
    FOREIGN KEY (id_location) REFERENCES Location(id_location),
    FOREIGN KEY (id_service) REFERENCES Service(id_service)
);

-- ============================================
-- TABELLA DISPONIBILITÀ
-- ============================================
-- Obiettivo: Memorizzare fasce orarie disponibili per ogni tipo di spazio in una sede
CREATE TABLE Availability (
    id_availability INT PRIMARY KEY AUTO_INCREMENT, -- ID univoco disponibilità
    id_location INT NOT NULL,                       -- Sede associata
    id_space_type INT NOT NULL,                     -- Tipo di spazio
    date DATE NOT NULL,                             -- Data disponibilità
    start_time TIME NOT NULL,                       -- Ora inizio
    end_time TIME NOT NULL,                         -- Ora fine
    available_seats INT NOT NULL,                   -- Posti disponibili
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_location) REFERENCES Location(id_location),
    FOREIGN KEY (id_space_type) REFERENCES SpaceType(id_space_type)
);

-- ============================================
-- TABELLA STATI PRENOTAZIONE
-- ============================================
-- Obiettivo: Standardizzare stati di prenotazione
CREATE TABLE BookingStatus (
    id_booking_status INT PRIMARY KEY AUTO_INCREMENT, -- ID stato prenotazione
    name VARCHAR(50) NOT NULL                         -- Nome stato (es. confermata, annullata)
);

-- ============================================
-- TABELLA PRENOTAZIONI
-- ============================================
-- Obiettivo: Registrare prenotazioni fatte dagli utenti
CREATE TABLE Booking (
    id_booking INT PRIMARY KEY AUTO_INCREMENT,     -- ID prenotazione
    id_user INT NOT NULL,                          -- Utente che ha prenotato
    id_availability INT NOT NULL,                  -- Disponibilità scelta
    id_booking_status INT NOT NULL,                -- Stato della prenotazione
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Data prenotazione
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES User(id_user),
    FOREIGN KEY (id_availability) REFERENCES Availability(id_availability),
    FOREIGN KEY (id_booking_status) REFERENCES BookingStatus(id_booking_status)
);

-- ============================================
-- TABELLA PAGAMENTI (integrata)
-- ============================================
-- Obiettivo: Memorizzare tutti i dettagli di pagamento in un'unica tabella
CREATE TABLE Payment (
    id_payment INT PRIMARY KEY AUTO_INCREMENT,     -- ID pagamento
    id_booking INT NOT NULL,                       -- Prenotazione associata
    amount DECIMAL(10,2) NOT NULL,                 -- Importo pagato
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Data pagamento
    method VARCHAR(50) NOT NULL,                   -- Metodo pagamento (es. carta, PayPal)
    status VARCHAR(50) NOT NULL,                   -- Stato pagamento (es. completato, fallito)
    FOREIGN KEY (id_booking) REFERENCES Booking(id_booking)
);

-- ============================================
-- TABELLA NOTIFICHE
-- ============================================
-- Obiettivo: Tenere traccia delle comunicazioni inviate agli utenti
CREATE TABLE Notification (
    id_notification INT PRIMARY KEY AUTO_INCREMENT, -- ID notifica
    id_user INT NOT NULL,                           -- Utente destinatario
    message VARCHAR(255) NOT NULL,                  -- Testo del messaggio
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,     -- Data invio
    read_at DATETIME NULL,                          -- Data lettura
    status VARCHAR(50) NOT NULL,                    -- Stato (letto, non letto)
    FOREIGN KEY (id_user) REFERENCES User(id_user)
);
