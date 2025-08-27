#!/bin/bash
# Script per il ripristino del database coworkspace_db da backup
# Autore: Diego Guidi

# Variabili configurabili
PGUSER="postgres"
PGDATABASE="coworkspace_db"
BACKUP_FILE="$1"  # Percorso file di backup passato come parametro

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <file_backup.sql.gz>"
    exit 1
fi

# Decomprimere e ripristinare il backup
gunzip -c $BACKUP_FILE | psql -U $PGUSER -d $PGDATABASE

if [ $? -eq 0 ]; then
    echo "Restore eseguito con successo da: $BACKUP_FILE"
else
    echo "Errore durante il restore"
fi
