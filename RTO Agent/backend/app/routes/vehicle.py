from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate
from datetime import datetime
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


@router.post("")
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    
    new_vehicle = Vehicle(
        VEHICLE_NUMBER=vehicle.VEHICLE_NUMBER,
        CHASSIS_NUMBER=vehicle.CHASSIS_NUMBER,
        FC_EXPIRY_DATE=vehicle.FC_EXPIRY_DATE,
        NP_EXPIRY_DATE=vehicle.NP_EXPIRY_DATE,
        PERMIT_EXPIRY_DATE=vehicle.PERMIT_EXPIRY_DATE,
        OWNER_NAME=vehicle.OWNER_NAME,
        OWNER_WHATSAPP=vehicle.OWNER_WHATSAPP,
        OWNER_CONTACT=vehicle.OWNER_CONTACT,
        VEHICLE_TYPE=vehicle.VEHICLE_TYPE,
        INSURANCE_EXPIRY=vehicle.INSURANCE_EXPIRY,
        ENGINE_NUMBER=vehicle.ENGINE_NUMBER,
        ADDRESS=vehicle.ADDRESS,
        REMARKS=vehicle.REMARKS
    )

    db.add(new_vehicle)

    db.commit()

    db.refresh(new_vehicle)

    return {
        "message": "Vehicle Created Successfully",
        "vehicle_id": new_vehicle.VEHICLE_ID
    }
    
@router.get("")
def get_vehicles(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    
    vehicles = db.query(Vehicle).all()

    return vehicles    

@router.get("/{vehicle_id}")
def get_vehicle_by_id(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.VEHICLE_ID == vehicle_id)
        .first()
    )

    if vehicle is None:
        return {
            "message": "Vehicle Not Found"
        }

    return vehicle

@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    existing_vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.VEHICLE_ID == vehicle_id)
        .first()
    )

    if existing_vehicle is None:
        return {
            "message": "Vehicle Not Found"
        }

    existing_vehicle.VEHICLE_NUMBER = vehicle.VEHICLE_NUMBER
    existing_vehicle.CHASSIS_NUMBER = vehicle.CHASSIS_NUMBER
    existing_vehicle.FC_EXPIRY_DATE = vehicle.FC_EXPIRY_DATE
    existing_vehicle.NP_EXPIRY_DATE = vehicle.NP_EXPIRY_DATE
    existing_vehicle.PERMIT_EXPIRY_DATE = vehicle.PERMIT_EXPIRY_DATE
    existing_vehicle.OWNER_NAME = vehicle.OWNER_NAME
    existing_vehicle.OWNER_WHATSAPP = vehicle.OWNER_WHATSAPP
    existing_vehicle.OWNER_CONTACT = vehicle.OWNER_CONTACT
    existing_vehicle.VEHICLE_TYPE = vehicle.VEHICLE_TYPE
    existing_vehicle.INSURANCE_EXPIRY = vehicle.INSURANCE_EXPIRY
    existing_vehicle.ENGINE_NUMBER = vehicle.ENGINE_NUMBER
    existing_vehicle.ADDRESS = vehicle.ADDRESS
    existing_vehicle.REMARKS = vehicle.REMARKS

    existing_vehicle.UPDATED_DATE = datetime.now()

    db.commit()

    return {
        "message": "Vehicle Updated Successfully"
    }
    
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    existing_vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.VEHICLE_ID == vehicle_id)
        .first()
    )

    if existing_vehicle is None:
        return {
            "message": "Vehicle Not Found"
        }

    db.delete(existing_vehicle)

    db.commit()

    return {
        "message": "Vehicle Deleted Successfully"
    }    
