# Database Coworkspace - Setup e Utilizzo

## Descrizione
Questo progetto contiene la struttura e i dati iniziali per la creazione di un database PostgreSQL dedicato alla gestione di utenti, sedi, disponibilità, prenotazioni e pagamenti.

## Requisiti
- PostgreSQL versione 12 o superiore
- Accesso con un utente dotato dei permessi necessari per creare database e tabelle
- Strumento per l’esecuzione di query SQL (ad esempio `psql` o pgAdmin)

## Procedura di installazione

### 1. Creazione del database
Eseguire il comando per creare il database (se non già esistente):
```sql
CREATE DATABASE coworkspace_db;


Per eseguire lo script setup.sql e creare le tabelle e i dati iniziali, utilizzare una delle seguenti modalità:

psql -U <nome_utente> -d coworkspace_db (Questo eil nome della db) -f setup.sql


o 

Tramite pgAdmin:
Collegarsi al server PostgreSQL

Creare il database coworkspace_db

Aprire lo strumento Query Tool sul database creato

Caricare e eseguire il file setup.sql



PER IL UTILIZZO DI backup E restore


./backup.sh
./backup/backup_coworkspace_db_20250808_121530.sql.gz

backup_coworkspace_db_20250808_121530 QUESTO E IL NOME DEL BACK UP
