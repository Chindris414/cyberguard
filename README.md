# CyberGuard

**CyberGuard** is an open-source defensive security operations platform designed to support security monitoring, threat detection, incident management, and operational visibility.

The project is being developed incrementally, with an emphasis on maintainability, security, automated testing, and extensibility.

> **Development status:** Foundation phase — v0.1.0. Core security operations functionality is planned for future releases.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Database | PostgreSQL |
| Cache and task infrastructure | Redis |
| Database ORM | SQLAlchemy |
| Database migrations | Alembic |
| Backend testing | pytest |
| Frontend validation | ESLint, Next.js build |
| Infrastructure | Docker Compose |
| Continuous integration | GitHub Actions |

## Prerequisites

Before running CyberGuard locally, install:

- Python 3.14
- Node.js 24 and npm
- Docker Desktop or Docker Engine with Compose
- Git

For Windows development, Ubuntu under WSL2 is supported.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Chindris414/cyberguard.git
cd cyberguard
```

### 2. Configure Environment Variables

Create a local environment configuration from the example:

```bash
cp .env.example .env
```

Edit `.env` and replace `replace_with_a_secure_password` with your own secure PostgreSQL password.

Never commit `.env` or other files containing credentials.

### 3. Start Infrastructure Services

```bash
docker compose up -d
docker compose ps
```

This starts PostgreSQL and Redis.

For local development, the services use:

| Service | Address |
|---|---|
| PostgreSQL | `127.0.0.1:55432` |
| Redis | `127.0.0.1:56379` |

### 4. Set Up the Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Apply database migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

Backend endpoints:

- API root: http://127.0.0.1:8000/
- Health check: http://127.0.0.1:8000/api/v1/health
- Interactive API documentation: http://127.0.0.1:8000/docs

### 5. Set Up the Frontend

Open another terminal:

```bash
cd cyberguard/frontend
npm ci
npm run dev
```

If your terminal is already inside the CyberGuard repository, use `cd frontend` instead.

Open http://localhost:3000 to access the CyberGuard welcome page.

## Running Tests

### Backend

From the `backend` directory, with the Python virtual environment activated and PostgreSQL running:

```bash
python -m pytest -v
```

### Frontend

From the `frontend` directory:

```bash
npm run lint
npm run build
```

## Continuous Integration

GitHub Actions automatically validates the project on pushes and pull requests targeting `main`.

- **Backend CI:** Installs dependencies, starts PostgreSQL, applies migrations, and runs pytest.
- **Frontend CI:** Installs dependencies, runs ESLint, and builds the Next.js application.

## Project Documentation

- [Development Roadmap](ROADMAP.md)
- [Product Specification](docs/cyberguard-spec.md)

The roadmap describes the planned development phases and individual feature goals.

## Security and Development Principles

CyberGuard is intended for authorized defensive security operations.

Development uses synthetic test data and controlled environments. Production-ready security controls, authentication, authorization, and operational capabilities will be implemented incrementally.

## License

See [LICENSE](LICENSE) for the project's licensing terms.