from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import Numeric
from sqlalchemy.orm import relationship

from app.database.db import Base


class Invoice(Base):
    __tablename__ = "INVOICES"

    INVOICE_ID = Column(Integer, primary_key=True, index=True)

    INVOICE_NUMBER = Column(String(30), unique=True, nullable=False)

    CLIENT_NAME = Column(String(150), nullable=False)

    CLIENT_ADDRESS = Column(String(250))

    INVOICE_DATE = Column(Date, nullable=False)

    TOTAL_AMOUNT = Column(Numeric(12, 2), nullable=False, default=0)

    CREATED_DATE = Column(DateTime)

    UPDATED_DATE = Column(DateTime)

    ITEMS = relationship(
        "InvoiceItem",
        cascade="all, delete-orphan",
        order_by="InvoiceItem.ITEM_ID"
    )
