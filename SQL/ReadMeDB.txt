Artigianato Online - Setup Database
Requisiti

PostgreSQL (versione consigliata ≥17)

Windows (CMD o PowerShell)

1. Avvio del server PostgreSQL

Assicurati che il server PostgreSQL sia in esecuzione e ascolti sulla porta corretta (di default 5432).

2. Accesso a PostgreSQL

Apri la shell di PostgreSQL e connettiti come utente postgres:

psql -h localhost -p 5432 -U postgres -d postgres


Ti verrà chiesta la password dell’utente postgres.

3. Creazione del database

Se il database non esiste ancora:

CREATE DATABASE coworkspace_db;

4. Connessione al database
\c coworkspace_db

5. Esecuzione dello script SQL

Esegui il file setup.sql per creare tabelle e indici:

\i 'C:/Users/diego/Desktop/Artigianato-online-main/database/DataBase/setup.sql'


Nota: eventuali messaggi NOTICE su indici o constraint già esistenti possono essere ignorati.

6. Controllo delle tabelle

Per verificare che tutte le tabelle siano state create correttamente:

\dt

7. Spegnimento e sicurezza

Per chiudere la sessione PostgreSQL:

\q


Il server PostgreSQL può essere fermato tramite pgAdmin o tramite servizi Windows se necessario.


PER IL UTILIZZO DI backup E restore


./backup.sh
./backup/backup_coworkspace_db_20250808_121530.sql.gz

backup_coworkspace_db_20250808_121530 QUESTO E IL NOME DEL BACK UP
