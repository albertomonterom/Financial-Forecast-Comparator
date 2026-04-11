import yfinance as yf
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/tickers", tags=["tickers"])


@router.get("/search")
async def search_tickers(q: str = ""):
    """Search tickers by symbol or company name using Yahoo Finance."""
    if not q or len(q) < 1:
        return []

    try:
        search = yf.Search(q, max_results=8)
        results = []
        for quote in search.quotes:
            symbol = quote.get("symbol", "")
            name = quote.get("longname") or quote.get("shortname") or ""
            if symbol and name:
                results.append({"symbol": symbol, "name": name})
        return results
    except Exception:
        return []
