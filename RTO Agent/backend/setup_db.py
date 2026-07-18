"""
One-time setup for a brand new machine: creates the database (if missing),
creates the USERS/VEHICLES/INVOICES/INVOICE_ITEMS tables, and creates
a default login.

Run once, after installing SQL Server + the ODBC driver and filling in .env:
    venv\\Scripts\\activate
    python setup_db.py
"""
from datetime import datetime

import pyodbc

from app.config.settings import (
    DB_SERVER,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DRIVER,
)

master_conn_str = (
    f"DRIVER={{{DB_DRIVER}}};SERVER={DB_SERVER};DATABASE=master;"
    f"UID={DB_USERNAME};PWD={DB_PASSWORD}"
)

conn = pyodbc.connect(master_conn_str, autocommit=True)
cursor = conn.cursor()
cursor.execute(
    f"IF DB_ID('{DB_DATABASE}') IS NULL CREATE DATABASE [{DB_DATABASE}]"
)
conn.close()
print(f"Database '{DB_DATABASE}' is ready.")

from app.database.db import Base, engine, SessionLocal
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.utils.security import hash_password

Base.metadata.create_all(bind=engine)
print("Tables created (USERS, VEHICLES, INVOICES, INVOICE_ITEMS).")

db = SessionLocal()
existing = db.query(User).filter(User.USERNAME == "admin").first()

if existing is None:
    admin = User(
        USERNAME="admin",
        PASSWORD_HASH=hash_password("admin123"),
        FULL_NAME="Administrator",
        IS_ACTIVE=True,
        CREATED_DATE=datetime.now(),
    )
    db.add(admin)
    db.commit()
    print("Default login created -> username: admin / password: admin123")
    print("Log in with this, then use 'Change Password' to set your own.")
else:
    print("An 'admin' user already exists, nothing to do.")

db.close()
print("Setup complete.")
