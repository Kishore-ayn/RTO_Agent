from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User

from app.schemas.user import LoginRequest

from app.utils.security import verify_password

from app.utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    
    user = (
        db.query(User)
        .filter(
            User.USERNAME == login_data.username
        )
        .first()
    )
    print("Username entered:", login_data.username)
    print("User found:", user)
    if user is None:
        return {
            "message": "Invalid Username or Password"
        }

    print("Password entered:", login_data.password)
    print("Stored hash:", user.PASSWORD_HASH)
    print(
    "Verify result:",
    verify_password(
        login_data.password,
        user.PASSWORD_HASH
    )
)
    
    if not verify_password(
        login_data.password,
        user.PASSWORD_HASH
    ):
        return {
            "message": "Invalid Username or Password"
        }

    token = create_access_token(
        {
            "sub": user.USERNAME
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }