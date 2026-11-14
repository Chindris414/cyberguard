from fastapi import FastAPI

app = FastAPI(
    title="CyberGuard API",
    description="Defensive Security Operations Platform",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "application": "CyberGuard",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "cyberguard-backend",
    }