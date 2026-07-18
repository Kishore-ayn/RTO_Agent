from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse

from app.database.db import test_connection

from app.routes.vehicle import router as vehicle_router
from app.routes.auth import router as auth_router
from app.routes.invoice import router as invoice_router
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from fastapi.middleware.cors import CORSMiddleware
from app.routes import dashboard

FRONTEND_DIST = (
    Path(__file__).resolve().parent.parent.parent
    / "frontend"
    / "dist"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    test_connection()


app.include_router(vehicle_router)
app.include_router(auth_router)
app.include_router(invoice_router)
app.include_router(dashboard.router)


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):

    requested_path = (
        FRONTEND_DIST / full_path
    ).resolve()

    if (
        requested_path.is_file()
        and FRONTEND_DIST.resolve() in requested_path.parents
    ):
        return FileResponse(requested_path)

    return FileResponse(
        FRONTEND_DIST / "index.html"
    )