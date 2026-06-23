from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta 

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

    next_30_days = today + timedelta(days=30)

    fc_due = db.query(
        Vehicle
    ).filter(
        Vehicle.FC_EXPIRY_DATE != None,
        Vehicle.FC_EXPIRY_DATE <= next_30_days
    ).count()

    np_due = db.query(
        Vehicle
    ).filter(
        Vehicle.NP_EXPIRY_DATE != None,
        Vehicle.NP_EXPIRY_DATE <= next_30_days
    ).count()

    permit_due = db.query(
        Vehicle
    ).filter(
        Vehicle.PERMIT_EXPIRY_DATE != None,
        Vehicle.PERMIT_EXPIRY_DATE <= next_30_days
    ).count()

    insurance_due = db.query(
        Vehicle
    ).filter(
        Vehicle.INSURANCE_EXPIRY != None,
        Vehicle.INSURANCE_EXPIRY <= next_30_days
    ).count()

    return {
        "total_vehicles": total_vehicles,
        "fc_due": fc_due,
        "np_due": np_due,
        "permit_due": permit_due,
        "insurance_due": insurance_due
    }
    
@router.get("/fc-due")
def get_fc_due_vehicles(
    db: Session = Depends(get_db)
):

    today = date.today()

    next_30_days = (
        today + timedelta(days=30)
    )

    vehicles = db.query(
        Vehicle
    ).filter(
        Vehicle.FC_EXPIRY_DATE != None,
        Vehicle.FC_EXPIRY_DATE <= next_30_days
    ).all()

    return vehicles

@router.get("/permit-due")
def get_permit_due_vehicles(
    db: Session = Depends(get_db)
):

    today = date.today()

    next_30_days = (
        today + timedelta(days=30)
    )

    vehicles = db.query(
        Vehicle
    ).filter(
        Vehicle.PERMIT_EXPIRY_DATE != None,
        Vehicle.PERMIT_EXPIRY_DATE <= next_30_days
    ).all()

    return vehicles

@router.get("/insurance-due")
def get_insurance_due_vehicles(
    db: Session = Depends(get_db)
):

    today = date.today()
    
    next_30_days = (
        today + timedelta(days=30)
    )

    vehicles = db.query(
        Vehicle
    ).filter(
        Vehicle.INSURANCE_EXPIRY != None,
        Vehicle.INSURANCE_EXPIRY <= next_30_days
    ).all()

    return vehicles

@router.get("/np-due")
def get_np_due_vehicles(
    db: Session = Depends(get_db)
):

    today = date.today()

    next_30_days = (
        today + timedelta(days=30)
    )

    vehicles = db.query(
        Vehicle
    ).filter(
        Vehicle.NP_EXPIRY_DATE != None,
        Vehicle.NP_EXPIRY_DATE <= next_30_days
    ).all()

    return vehicles    