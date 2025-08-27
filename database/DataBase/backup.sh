#!/bin/bash
# Script per il backup completo del database coworkspace_db
# Autore: Diego Guidi

# Variabili configurabili
PGUSER="postgres"
PGDATABASE="coworkspace_db"
BACKUP_DIR="./backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$PGDATABASE_$DATE.sql.gz"

# Creazione directory backup se non esiste
mkdir -p $BACKUP_DIR

# Esecuzione del backup con compressione gzip
pg_dump -U $PGUSER -d $PGDATABASE | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup eseguito con successo: $BACKUP_FILE"
else
    echo "Errore durante il backup"
fi
