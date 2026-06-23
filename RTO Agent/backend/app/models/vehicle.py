from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime

from app.database.db import Base


class Vehicle(Base):
    __tablename__ = "VEHICLES"

    VEHICLE_ID = Column(Integer, primary_key=True, index=True)

    VEHICLE_NUMBER = Column(String(20), nullable=False)

    CHASSIS_NUMBER = Column(String(100))

    FC_EXPIRY_DATE = Column(Date)

    NP_EXPIRY_DATE = Column(Date)

    PERMIT_EXPIRY_DATE = Column(Date)

    OWNER_NAME = Column(String(100))

    OWNER_WHATSAPP = Column(String(15))

    OWNER_CONTACT = Column(String(15))

    CREATED_DATE = Column(DateTime)

    VEHICLE_TYPE = Column(String(100))

    INSURANCE_EXPIRY = Column(Date)

    ENGINE_NUMBER = Column(String(20))

    ADDRESS = Column(String(250))

    REMARKS = Column(String(1000))

    UPDATED_DATE = Column(DateTime)