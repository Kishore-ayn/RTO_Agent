from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database.db import get_db
from app.models.vehicle import Vehicle

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    today = date.today()

    total_vehicles = db.query(
        Vehicle
    ).count()

    fc_due = db.query(
        Vehicle
    ).filter(
        Vehicle.FC_EXPIRY_DATE != None,
        Vehicle.FC_EXPIRY_DATE <= today
    ).count()

    np_due = db.query(
        Vehicle
    ).filter(
        Vehicle.NP_EXPIRY_DATE != None,
        Vehicle.NP_EXPIRY_DATE <= today
    ).count()

    permit_due = db.query(
        Vehicle
    ).filter(
        Vehicle.PERMIT_EXPIRY_DATE != None,
        Vehicle.PERMIT_EXPIRY_DATE <= today
    ).count()

    insurance_due = db.query(
        Vehicle
    ).filter(
        Vehicle.INSURANCE_EXPIRY != None,
        Vehicle.INSURANCE_EXPIRY <= today
    ).count()

    return {
        "total_vehicles": total_vehicles,
        "fc_due": fc_due,
        "np_due": np_due,
        "permit_due": permit_due,
        "insurance_due": insurance_due
    }