# Local Setup with Docker & Docker Compose

This project is fully dockerized; the entire stack (frontend, backend, and PostgreSQL) can be built and launched using Docker Compose.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running All Services
To start all services from the project root, execute:

```bash
docker compose up --build
```

- This command builds and starts:
  - The PostgreSQL database using the project schema
  - The backend Node.js service
  - The frontend static files with Nginx

## Accessing Services
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **PostgreSQL Database:** accessible on localhost:5432 (used by the backend service)

## Management Commands
- To stop and remove all containers:
  ```bash
  docker compose down
  ```
- To rebuild images after changes:
  ```bash
  docker compose up --build
  ```

## Logs & Debugging

Container logs are useful for troubleshooting and monitoring application behavior:

- **View live logs for all services:**
  ```bash
  docker compose logs -f
  ```

- **View logs for a specific service:**
  ```bash
  docker compose logs -f backend
  docker compose logs -f db
  docker compose logs -f frontend
  ```

- **View recent logs (not following):**
  ```bash
  docker compose logs backend
  ```

- **Check startup or crash issues:**
  Consult logs for backend or database containers for error messages.

## Notes and Troubleshooting
- Ensure that no other process is using ports 3000, 5173, or 5432.
- On first run, the database schema from `SQL/setup.sql` is loaded automatically.
- Database data is persisted in the Docker named volume `db_data`.


