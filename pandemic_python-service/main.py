"""
Pandemic Analytics Service
Risk scoring, hotspot detection, and summary insights.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI(title="Pandemic Analytics", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AreaData(BaseModel):
    name: str
    active: int = 0
    total: int = 0
    deaths: int = 0
    population: int = 10000
    risk: str = "low"


class GlobalData(BaseModel):
    totalCases: int = 0
    totalRecovered: int = 0
    totalDeaths: int = 0
    activeCases: int = 0


class AnalyzeRequest(BaseModel):
    areas: List[AreaData]
    global_data: Optional[GlobalData] = None

    class Config:
        fields = {"global_data": "global"}


@app.get("/")
def root():
    return {"service": "Pandemic Analytics API", "endpoints": ["/analyze", "/health"]}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    areas = req.areas
    total_active = sum(a.active for a in areas)
    total_pop = sum(a.population for a in areas) or 1

    # Hotspots: high/critical risk or high active rate
    hotspots = []
    for a in areas:
        rate = (a.active / a.population * 1000) if a.population else 0
        if a.risk in ("high", "critical") or rate >= 15:
            hotspots.append({
                "name": a.name,
                "active": a.active,
                "rate_per_1000": round(rate, 2),
                "risk": a.risk
            })

    hotspots = sorted(hotspots, key=lambda x: x["active"], reverse=True)[:10]

    # Risk distribution
    risk_dist = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    for a in areas:
        risk_dist[a.risk] = risk_dist.get(a.risk, 0) + 1

    # Overall risk score 0-100
    if not areas:
        overall = 0
    else:
        weighted = sum(
            {"low": 10, "moderate": 35, "high": 65, "critical": 90}.get(a.risk, 20)
            for a in areas
        ) / len(areas)
        overall = round(weighted, 1)

    recovery_rate = 0
    fatality_rate = 0
    if req.global_data and req.global_data.totalCases > 0:
        recovery_rate = round(req.global_data.totalRecovered / req.global_data.totalCases * 100, 1)
        fatality_rate = round(req.global_data.totalDeaths / req.global_data.totalCases * 100, 1)

    return {
        "overall_risk_score": overall,
        "total_areas": len(areas),
        "total_active": total_active,
        "hotspots": hotspots,
        "risk_distribution": risk_dist,
        "recovery_rate_pct": recovery_rate,
        "fatality_rate_pct": fatality_rate,
        "recommendation": (
            "Immediate containment needed in hotspots" if overall >= 60
            else "Monitor high-risk areas closely" if overall >= 35
            else "Situation under control – continue surveillance"
        )
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
