from pydantic import BaseModel
from datetime import date
from typing import Optional


class VehicleCreate(BaseModel):
    VEHICLE_NUMBER: str

    CHASSIS_NUMBER: Optional[str] = None

    FC_EXPIRY_DATE: Optional[date] = None

    NP_EXPIRY_DATE: Optional[date] = None

    PERMIT_EXPIRY_DATE: Optional[date] = None

    OWNER_NAME: Optional[str] = None

    OWNER_WHATSAPP: Optional[str] = None

    OWNER_CONTACT: Optional[str] = None

    VEHICLE_TYPE: Optional[str] = None

    INSURANCE_EXPIRY: Optional[date] = None

    ENGINE_NUMBER: Optional[str] = None

    ADDRESS: Optional[str] = None

    REMARKS: Optional[str] = None