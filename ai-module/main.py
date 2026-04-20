from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime

app = FastAPI()

class RouteRequest(BaseModel):
    start: str
    end: str

class CrowdData(BaseModel):
    zone: str
    density: float

class Zone(BaseModel):
    id: str
    name: str
    density: int
    maxCapacity: int

class Queue(BaseModel):
    id: str
    name: str
    waitTimeMins: int

class SuggestionRequest(BaseModel):
    crowdData: List[Zone]
    queues: List[Queue]

@app.get("/")
def read_root():
    return {"message": "AI Module running"}

@app.post("/predict-route")
def predict_route(req: RouteRequest):
    paths = [
        [req.start, "Corridor A", "Gate 2", req.end],
        [req.start, "Lobby", "Stairs", req.end],
        [req.start, "North Wing", "Food Court", req.end],
        [req.start, "East Hallway", req.end]
    ]
    chosen_path = random.choice(paths)
    estimated_time = len(chosen_path) * random.randint(1, 3)
    
    return {
        "route": chosen_path,
        "estimatedTimeMins": estimated_time,
        "algorithm": "A* Dynamic Pathfinding Simulation"
    }

@app.post("/anomaly-detect")
def anomaly_detect(data: CrowdData):
    is_anomaly = data.density > 90
    return {
        "zone": data.zone,
        "isAnomaly": is_anomaly,
        "confidence": 0.95 if is_anomaly else 0.88,
        "timestamp": str(datetime.now())
    }

@app.post("/facility-suggestion")
def facility_suggestion(req: SuggestionRequest):
    best_queue = min(req.queues, key=lambda q: q.waitTimeMins)
    best_zone = min(req.crowdData, key=lambda z: z.density)
    
    return {
        "suggestion": f"AI Suggestion: '{best_queue.name}' has the lowest wait time right now ({best_queue.waitTimeMins} mins). Alternatively, relax at '{best_zone.name}' which is currently only {best_zone.density}% full."
    }
