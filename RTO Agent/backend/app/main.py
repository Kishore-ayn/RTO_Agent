from fastapi import FastAPI

from app.database.db import test_connection

from app.routes.vehicle import router as vehicle_router
from app.routes.auth import router as auth_router
from app.models.vehicle import Vehicle
from app.models.user import User

app = FastAPI()


@app.on_event("startup")
def startup_event():
    test_connection()


app.include_router(vehicle_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "RTO Application Running"
    }