from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Boolean

from app.database.db import Base


class User(Base):
    __tablename__ = "USERS"

    USER_ID = Column(Integer, primary_key=True, index=True)

    USERNAME = Column(String(50), unique=True, nullable=False)

    PASSWORD_HASH = Column(String(255), nullable=False)

    FULL_NAME = Column(String(100))

    IS_ACTIVE = Column(Boolean)

    CREATED_DATE = Column(DateTime)