# Architettura Backend

Il backend di questo progetto segue una struttura modulare e ben organizzata, suddivisa in diversi livelli di responsabilità.  
Di seguito viene descritta l’architettura generale senza entrare nei dettagli implementativi.

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
  - I controller gestiscono le richieste HTTP (ad esempio GET, POST, PUT, DELETE) relative a ciascun oggetto.
  - Ricevono le richieste dal client, interagiscono con i servizi per eseguire la logica necessaria e restituiscono le risposte appropriate.