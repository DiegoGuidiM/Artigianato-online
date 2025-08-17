# Architettura Backend

Il backend di questo progetto segue una struttura modulare e ben organizzata, suddivisa in diversi livelli di responsabilità.  
Di seguito viene descritta l’architettura generale senza entrare nei dettagli implementativi.

## Requisiti

- Nella cartella principale del progetot, creare un file venv.env, e scrivere:
    DB_HOST=host (localhost finché in locale)
    DB_USER=user (nome utente personale di PostgreSQL, generalmente postgres)
    DB_PASSWORD=password (password associata all'utente precedentemente inserito, generalmente 5432)
- Su terminale prima dell'avvio del programma digitare
  - npm install express
  - npm install knex pg
  - npm install dotenv  

## Struttura dei Componenti

- **Model**
  - Le classi model rappresentano i singoli elementi del database come oggetti JavaScript.
  - Ogni model riflette una tabella del database e ne definisce le proprietà principali.

- **Repository**
  - I repository si occupano della gestione della persistenza dei dati.
  - Ogni repository fornisce metodi per leggere, scrivere, aggiornare ed eliminare dati dalla rispettiva tabella del database.
  - In questo modo, l’accesso ai dati è centralizzato e facilmente gestibile.

- **Service**
  - I servizi implementano la logica di business dell’applicazione.
  - Qui vengono gestite operazioni complesse come la validazione delle prenotazioni, dei pagamenti e altre regole specifiche del dominio.
  - I services utilizzano i repository per accedere ai dati e forniscono funzionalità ai controller.

- **Controller**
  - I controller contengono tutte le funzioni per la gestione di richieste HTTP (ad esempio GET, POST, PUT, DELETE) relative a ciascun oggetto.
  - Ricevono le richieste dal client, interagiscono con i servizi per eseguire la logica necessaria e restituiscono le risposte appropriate.
  - Le routes contenenti le richieste HTTP vere e proprie sono contenute nel file routes, per garantire una maggiore pulizia del codice dei controlli stessi e del main.

## Librerie e framework usati

- **Express.js**
  - Express.js è un framework pensato per costruire API insieme a Node.js (ambiene standard per eseguire JavaScript al di fuori di un browser), e fornisce metodi fondamentali per la gestione di routes, richieste HTTP e programmazione asincrona.

- **Knex.js**
  - Knex.js è un query builder basato su ORM per Node.js che fornisce metodi e funzioni per PostgreSQL, implementando query classiche o uno stile più vicino a quello della programmazione asincrona tramite promises.

- **dotenv**
  - dotenv è un modulo utilizzato per importare dati e variabili d'ambiente da file .env a moduli e classi del programma.