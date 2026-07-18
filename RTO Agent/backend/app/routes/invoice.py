from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.db import get_db
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.schemas.invoice import InvoiceCreate
from datetime import datetime
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)


def generate_invoice_number(db: Session, invoice_date):
    year = invoice_date.year
    prefix = f"INV-{year}-"

    # Based on the highest existing sequence number for the year, not a row
    # count, so a gap left by a deleted invoice never gets reissued to a
    # different invoice still in the table.
    existing_numbers = (
        db.query(Invoice.INVOICE_NUMBER)
        .filter(Invoice.INVOICE_NUMBER.like(f"{prefix}%"))
        .all()
    )

    max_sequence = 0

    for (number,) in existing_numbers:
        suffix = number[len(prefix):]

        if suffix.isdigit():
            max_sequence = max(max_sequence, int(suffix))

    return f"{prefix}{max_sequence + 1:04d}"


def serialize_invoice(invoice: Invoice):
    return {
        "INVOICE_ID": invoice.INVOICE_ID,
        "INVOICE_NUMBER": invoice.INVOICE_NUMBER,
        "CLIENT_NAME": invoice.CLIENT_NAME,
        "CLIENT_ADDRESS": invoice.CLIENT_ADDRESS,
        "INVOICE_DATE": invoice.INVOICE_DATE,
        "TOTAL_AMOUNT": invoice.TOTAL_AMOUNT,
        "CREATED_DATE": invoice.CREATED_DATE,
        "UPDATED_DATE": invoice.UPDATED_DATE,
        "ITEMS": [
            {
                "ITEM_ID": item.ITEM_ID,
                "PARTICULARS": item.PARTICULARS,
                "QUANTITY": item.QUANTITY,
                "RATE": item.RATE,
                "AMOUNT": item.AMOUNT,
            }
            for item in invoice.ITEMS
        ],
    }


@router.post("")
def create_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    total_amount = sum(item.AMOUNT for item in invoice.ITEMS)

    # Invoice numbers are derived from a count query, so two saves landing at
    # nearly the same moment can compute the same number; retry with a fresh
    # count on a collision instead of failing the whole request.
    max_attempts = 5

    for attempt in range(max_attempts):

        new_invoice = Invoice(
            INVOICE_NUMBER=generate_invoice_number(db, invoice.INVOICE_DATE),
            CLIENT_NAME=invoice.CLIENT_NAME,
            CLIENT_ADDRESS=invoice.CLIENT_ADDRESS,
            INVOICE_DATE=invoice.INVOICE_DATE,
            TOTAL_AMOUNT=total_amount,
            CREATED_DATE=datetime.now()
        )

        new_invoice.ITEMS = [
            InvoiceItem(
                PARTICULARS=item.PARTICULARS,
                QUANTITY=item.QUANTITY,
                RATE=item.RATE,
                AMOUNT=item.AMOUNT
            )
            for item in invoice.ITEMS
        ]

        db.add(new_invoice)

        try:
            db.commit()
            break
        except IntegrityError:
            db.rollback()

            if attempt == max_attempts - 1:
                raise HTTPException(
                    status_code=500,
                    detail="Could not generate a unique invoice number, please try saving again"
                )

    db.refresh(new_invoice)

    return {
        "message": "Invoice Created Successfully",
        "invoice_id": new_invoice.INVOICE_ID,
        "invoice_number": new_invoice.INVOICE_NUMBER
    }

@router.get("")
def get_invoices(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    invoices = (
        db.query(Invoice)
        .order_by(Invoice.INVOICE_ID.desc())
        .all()
    )

    return [
        serialize_invoice(invoice)
        for invoice in invoices
    ]

@router.get("/{invoice_id}")
def get_invoice_by_id(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    invoice = (
        db.query(Invoice)
        .filter(Invoice.INVOICE_ID == invoice_id)
        .first()
    )

    if invoice is None:
        return {
            "message": "Invoice Not Found"
        }

    return serialize_invoice(invoice)

@router.put("/{invoice_id}")
def update_invoice(
    invoice_id: int,
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    existing_invoice = (
        db.query(Invoice)
        .filter(Invoice.INVOICE_ID == invoice_id)
        .first()
    )

    if existing_invoice is None:
        return {
            "message": "Invoice Not Found"
        }

    existing_invoice.CLIENT_NAME = invoice.CLIENT_NAME
    existing_invoice.CLIENT_ADDRESS = invoice.CLIENT_ADDRESS
    existing_invoice.INVOICE_DATE = invoice.INVOICE_DATE
    existing_invoice.TOTAL_AMOUNT = sum(item.AMOUNT for item in invoice.ITEMS)
    existing_invoice.UPDATED_DATE = datetime.now()

    existing_invoice.ITEMS = [
        InvoiceItem(
            PARTICULARS=item.PARTICULARS,
            QUANTITY=item.QUANTITY,
            RATE=item.RATE,
            AMOUNT=item.AMOUNT
        )
        for item in invoice.ITEMS
    ]

    db.commit()

    return {
        "message": "Invoice Updated Successfully"
    }

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    existing_invoice = (
        db.query(Invoice)
        .filter(Invoice.INVOICE_ID == invoice_id)
        .first()
    )

    if existing_invoice is None:
        return {
            "message": "Invoice Not Found"
        }

    db.delete(existing_invoice)

    db.commit()

    return {
        "message": "Invoice Deleted Successfully"
    }
