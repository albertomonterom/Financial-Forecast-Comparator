from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, tickers

app = FastAPI(
    title="Financial Forecast Comparator API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tickers.router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
