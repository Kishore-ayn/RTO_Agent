from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import ForeignKey

from app.database.db import Base


class InvoiceItem(Base):
    __tablename__ = "INVOICE_ITEMS"

    ITEM_ID = Column(Integer, primary_key=True, index=True)

    INVOICE_ID = Column(Integer, ForeignKey("INVOICES.INVOICE_ID"), nullable=False)

    PARTICULARS = Column(String(500), nullable=False)

    QUANTITY = Column(Numeric(10, 2))

    RATE = Column(Numeric(12, 2))

    AMOUNT = Column(Numeric(12, 2), nullable=False)
