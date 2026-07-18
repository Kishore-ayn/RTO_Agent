from pydantic import BaseModel
from datetime import date
from typing import Optional
from typing import List


class InvoiceItemCreate(BaseModel):
    PARTICULARS: str

    QUANTITY: Optional[float] = None

    RATE: Optional[float] = None

    AMOUNT: float


class InvoiceCreate(BaseModel):
    CLIENT_NAME: str

    CLIENT_ADDRESS: Optional[str] = None

    INVOICE_DATE: date

    ITEMS: List[InvoiceItemCreate]
