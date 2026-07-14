"""
One-off bulk import of vehicle records from an Excel sheet into the VEHICLES table.

Usage (from backend/, with venv active):
    python import_vehicles.py "../../Prakash Transport Data.xlsx"          # dry run (default)
    python import_vehicles.py "../../Prakash Transport Data.xlsx" --commit  # actually writes to the DB

Column mapping (source -> VEHICLES):
    Vehicle Number    -> VEHICLE_NUMBER   (required; rows missing this get a placeholder
                                            "UNKNOWN-<S.No>" so the rest of the row isn't
                                            lost -- fix the real number later in the app)
    Chasis Number     -> CHASSIS_NUMBER
    FC Expiry         -> FC_EXPIRY_DATE
    NP Expiry         -> NP_EXPIRY_DATE   (if not a parseable date, e.g. "AP"/"NP", the
                                            text is appended to REMARKS instead and the
                                            date is left blank)
    Permit Expiry     -> PERMIT_EXPIRY_DATE
    Owner Name        -> OWNER_NAME
    Vehicle Type      -> VEHICLE_TYPE
    Owner Contact     -> OWNER_CONTACT
    Whatsapp Number   -> OWNER_WHATSAPP
    Insurance Expiry  -> INSURANCE_EXPIRY
    Address           -> ADDRESS
    Remarks           -> REMARKS
    Engine Number     -> ENGINE_NUMBER

Duplicate Vehicle Numbers are imported as separate rows (not deduplicated).
"""
import sys
import argparse
from datetime import datetime

import pandas as pd

from app.database.db import SessionLocal
from app.models.vehicle import Vehicle


def parse_date(value):
    if pd.isna(value):
        return None, None
    if isinstance(value, datetime):
        return value.date(), None
    parsed = pd.to_datetime(value, errors="coerce", dayfirst=False)
    if pd.isna(parsed):
        return None, str(value).strip()
    return parsed.date(), None


def clean_str(value):
    if pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def build_vehicle_rows(path):
    df = pd.read_excel(path)

    rows = []
    placeholder_numbers = 0
    np_text_moved = 0

    for _, r in df.iterrows():
        vehicle_number = clean_str(r.get("Vehicle Number"))
        if not vehicle_number:
            vehicle_number = f"UNKNOWN-{r.get('S.No')}"
            placeholder_numbers += 1

        fc_date, _ = parse_date(r.get("FC Expiry"))
        np_date, np_text = parse_date(r.get("NP Expiry"))
        permit_date, _ = parse_date(r.get("Permit Expiry"))
        insurance_date, _ = parse_date(r.get("Insurance Expiry"))

        remarks = clean_str(r.get("Remarks"))
        if np_text:
            np_text_moved += 1
            remarks = f"{remarks}; NP Expiry: {np_text}" if remarks else f"NP Expiry: {np_text}"

        rows.append(Vehicle(
            VEHICLE_NUMBER=vehicle_number,
            CHASSIS_NUMBER=clean_str(r.get("Chasis Number")),
            FC_EXPIRY_DATE=fc_date,
            NP_EXPIRY_DATE=np_date,
            PERMIT_EXPIRY_DATE=permit_date,
            OWNER_NAME=clean_str(r.get("Owner Name")),
            OWNER_WHATSAPP=clean_str(r.get("Whatsapp Number")),
            OWNER_CONTACT=clean_str(r.get("Owner Contact")),
            VEHICLE_TYPE=clean_str(r.get("Vehicle Type")),
            INSURANCE_EXPIRY=insurance_date,
            ENGINE_NUMBER=clean_str(r.get("Engine Number")),
            ADDRESS=clean_str(r.get("Address")),
            REMARKS=remarks,
            CREATED_DATE=datetime.now(),
        ))

    return rows, placeholder_numbers, np_text_moved, len(df)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("excel_path")
    parser.add_argument("--commit", action="store_true", help="Actually write to the database")
    args = parser.parse_args()

    rows, placeholder_numbers, np_text_moved, total = build_vehicle_rows(args.excel_path)

    print(f"Total rows in sheet:          {total}")
    print(f"Placeholder Vehicle Numbers:  {placeholder_numbers}")
    print(f"NP Expiry text -> Remarks:    {np_text_moved}")
    print(f"Rows to insert:               {len(rows)}")
    print()
    print("Sample of first 5 rows to be inserted:")
    for v in rows[:5]:
        print(f"  {v.VEHICLE_NUMBER!r:15} FC={v.FC_EXPIRY_DATE} NP={v.NP_EXPIRY_DATE} "
              f"PERMIT={v.PERMIT_EXPIRY_DATE} OWNER={v.OWNER_NAME!r} REMARKS={v.REMARKS!r}")

    if placeholder_numbers:
        print()
        print(f"Rows with a placeholder Vehicle Number (UNKNOWN-<S.No>):")
        for v in rows:
            if v.VEHICLE_NUMBER.startswith("UNKNOWN-"):
                print(f"  {v.VEHICLE_NUMBER!r:15} CHASSIS={v.CHASSIS_NUMBER!r} OWNER={v.OWNER_NAME!r}")

    if not args.commit:
        print()
        print("Dry run only -- nothing written. Re-run with --commit to insert into the database.")
        return

    db = SessionLocal()
    try:
        db.add_all(rows)
        db.commit()
        print(f"\nInserted {len(rows)} vehicle rows into VEHICLES.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
