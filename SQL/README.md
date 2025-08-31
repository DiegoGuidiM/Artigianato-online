# Artigianato Online — Database Setup Guide

## Requirements

- **PostgreSQL** (recommended version ≥ 17)
- **Windows** (CMD or PowerShell, or adjust for your OS)

## 1. Start PostgreSQL Server

Ensure that the PostgreSQL server is running and listening on the default port (`5432`).

## 2. Access PostgreSQL

Open the PostgreSQL shell and connect as `postgres` user:

```sh
psql -h localhost -p 5432 -U postgres -d postgres
```

_When prompted, enter the password for `postgres`._

## 3. Create the Database

If the database does not yet exist, run:

```sql
CREATE DATABASE coworkspace_db;
```

## 4. Connect to the Database

```sql
\c coworkspace_db
```

## 5. Run the Setup Script

Execute the provided SQL setup script to create tables and indexes:

```sql
\i 'C:/Users/diego/Desktop/Artigianato-online-main/database/DataBase/setup.sql'
```

> [!NOTE]  
> _If you see `NOTICE` messages about existing indexes or constraints, these can be ignored._

## 6. Check Tables

To verify tables were created correctly:

```sql
\dt
```

## 7. Shutdown & Security

To disconnect from PostgreSQL:

```sql
\q
```

You may also stop PostgreSQL server using pgAdmin or Windows services if needed.

## Backup & Restore Usage

To back up the database:

```sh
./backup.sh
```

The generated backup file will look like:

```
./backup/backup_coworkspace_db_20250808_121530.sql.gz
```

`backup_coworkspace_db_20250808_121530` is the backup file name format.

To restore, use the provided `restore.sh` script or follow your standard restore procedures.
